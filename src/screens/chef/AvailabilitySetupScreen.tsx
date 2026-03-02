import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChefOnboarding } from '../../hooks/use-chef-onboarding';
import { setAvailability } from '../../services/availability-service';
import { ChefOnboardingParamList } from '../../navigation/ChefOnboardingNavigator';

type NavigationProp = NativeStackNavigationProp<ChefOnboardingParamList, 'AvailabilitySetup'>;

interface Props {
  navigation: NavigationProp;
}

interface AvailabilitySlot {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DEFAULT_START = '10:00';
const DEFAULT_END = '20:00';

function createDefaultSlots(): AvailabilitySlot[] {
  return DAY_NAMES.map((_, i) => ({
    dayOfWeek: i,
    enabled: false,
    startTime: DEFAULT_START,
    endTime: DEFAULT_END,
  }));
}

export default function AvailabilitySetupScreen({ navigation }: Props) {
  const { chefProfile, availability, refreshAvailability } = useChefOnboarding();
  const [slots, setSlots] = useState<AvailabilitySlot[]>(createDefaultSlots);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (availability.length > 0) {
      const updated = createDefaultSlots();
      for (const existing of availability) {
        const slot = updated.find((s) => s.dayOfWeek === existing.dayOfWeek);
        if (slot) {
          slot.enabled = true;
          slot.startTime = existing.startTime;
          slot.endTime = existing.endTime;
        }
      }
      setSlots(updated);
    }
  }, [availability]);

  const toggleDay = (dayOfWeek: number) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.dayOfWeek === dayOfWeek ? { ...s, enabled: !s.enabled } : s,
      ),
    );
  };

  const updateTime = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s,
      ),
    );
  };

  const handleSave = async () => {
    if (!chefProfile) return;

    const enabledSlots = slots.filter((s) => s.enabled);

    // Validate time format
    for (const slot of enabledSlots) {
      const timeRegex = /^\d{1,2}:\d{2}$/;
      if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
        Alert.alert(
          'Invalid Time',
          `Please use HH:MM format for ${DAY_NAMES[slot.dayOfWeek]}.`,
        );
        return;
      }
    }

    setIsSaving(true);
    try {
      await setAvailability(
        chefProfile.id,
        enabledSlots.map((s) => ({
          day_of_week: s.dayOfWeek,
          start_time: s.startTime,
          end_time: s.endTime,
        })),
      );
      await refreshAvailability();
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save availability. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>Toggle the days you're available and set your hours.</Text>

      {slots.map((slot) => (
        <View key={slot.dayOfWeek} style={styles.dayRow}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayName}>{DAY_NAMES[slot.dayOfWeek]}</Text>
            <Switch
              value={slot.enabled}
              onValueChange={() => toggleDay(slot.dayOfWeek)}
              trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
              thumbColor={slot.enabled ? '#2563eb' : '#94a3b8'}
            />
          </View>
          {slot.enabled && (
            <View style={styles.timeRow}>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>Start</Text>
                <TextInput
                  style={styles.timeField}
                  value={slot.startTime}
                  onChangeText={(v) => updateTime(slot.dayOfWeek, 'startTime', v)}
                  placeholder="10:00"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              <Text style={styles.timeDash}>-</Text>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>End</Text>
                <TextInput
                  style={styles.timeField}
                  value={slot.endTime}
                  onChangeText={(v) => updateTime(slot.dayOfWeek, 'endTime', v)}
                  placeholder="20:00"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={isSaving}
        activeOpacity={0.7}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Availability</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    textAlign: 'center',
  },
  dayRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  timeField: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    fontSize: 15,
    color: '#1e293b',
    textAlign: 'center',
  },
  timeDash: {
    fontSize: 18,
    color: '#94a3b8',
    marginHorizontal: 12,
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

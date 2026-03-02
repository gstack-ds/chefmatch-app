import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServiceModel, GroceryArrangement } from '../../config/constants';
import { useAuth } from '../../hooks/use-auth';
import { createBooking } from '../../services/booking-service';

type BookingRequestParams = {
  BookingRequest: {
    chefId: string;
    chefName: string;
    conversationId: string | null;
  };
};

type BookingRequestRouteProp = RouteProp<BookingRequestParams, 'BookingRequest'>;

const SERVICE_MODEL_OPTIONS = [
  { value: ServiceModel.FULL_SERVICE, label: 'Full Service' },
  { value: ServiceModel.COLLABORATIVE, label: 'Collaborative' },
];

const GROCERY_OPTIONS = [
  { value: GroceryArrangement.CHEF_PROVIDES, label: 'Chef Provides' },
  { value: GroceryArrangement.CONSUMER_PROVIDES, label: 'I Provide' },
  { value: GroceryArrangement.SPLIT, label: 'Split' },
];

export default function BookingRequestScreen() {
  const route = useRoute<BookingRequestRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<BookingRequestParams>>();
  const { user } = useAuth();
  const { chefId, chefName, conversationId } = route.params;

  const [eventDate, setEventDate] = useState('');
  const [partySize, setPartySize] = useState('');
  const [occasion, setOccasion] = useState('');
  const [serviceModel, setServiceModel] = useState<ServiceModel>(ServiceModel.FULL_SERVICE);
  const [groceryArrangement, setGroceryArrangement] = useState<GroceryArrangement>(
    GroceryArrangement.CHEF_PROVIDES,
  );
  const [specialRequests, setSpecialRequests] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = eventDate.trim().length > 0 && parseInt(partySize, 10) > 0;

  const handleSubmit = async () => {
    if (!user || !canSubmit) return;

    setIsSubmitting(true);
    try {
      await createBooking({
        consumerId: user.id,
        chefId,
        conversationId,
        serviceModel,
        eventDate: eventDate.trim(),
        partySize: parseInt(partySize, 10),
        occasion: occasion.trim(),
        specialRequests: specialRequests.trim(),
        groceryArrangement,
        locationAddress: locationAddress.trim() || null,
      });
      Alert.alert('Booking Requested', `Your request has been sent to ${chefName}.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Book {chefName}</Text>

      <Text style={styles.label}>Event Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={eventDate}
        onChangeText={setEventDate}
        placeholder="2026-04-15"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Party Size</Text>
      <TextInput
        style={styles.input}
        value={partySize}
        onChangeText={setPartySize}
        placeholder="4"
        placeholderTextColor="#9ca3af"
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Occasion</Text>
      <TextInput
        style={styles.input}
        value={occasion}
        onChangeText={setOccasion}
        placeholder="Anniversary, Birthday, etc."
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Service Model</Text>
      <View style={styles.chipRow}>
        {SERVICE_MODEL_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, serviceModel === opt.value && styles.chipSelected]}
            onPress={() => setServiceModel(opt.value)}
          >
            <Text
              style={[styles.chipText, serviceModel === opt.value && styles.chipTextSelected]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Grocery Arrangement</Text>
      <View style={styles.chipRow}>
        {GROCERY_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, groceryArrangement === opt.value && styles.chipSelected]}
            onPress={() => setGroceryArrangement(opt.value)}
          >
            <Text
              style={[
                styles.chipText,
                groceryArrangement === opt.value && styles.chipTextSelected,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Location Address</Text>
      <TextInput
        style={styles.input}
        value={locationAddress}
        onChangeText={setLocationAddress}
        placeholder="123 Main St, City, State"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Special Requests</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={specialRequests}
        onChangeText={setSpecialRequests}
        placeholder="Allergies, dietary needs, etc."
        placeholderTextColor="#9ca3af"
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity
        style={[styles.submitButton, (!canSubmit || isSubmitting) && styles.disabled]}
        onPress={handleSubmit}
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Send Request</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipSelected: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  chipText: {
    fontSize: 14,
    color: '#374151',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#f97316',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
  },
  disabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

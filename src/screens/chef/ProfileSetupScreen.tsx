import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChefOnboarding } from '../../hooks/use-chef-onboarding';
import { updateChefProfile } from '../../services/chef-profile-service';
import { CUISINE_OPTIONS, ServiceModel } from '../../config/constants';
import { ChefOnboardingParamList } from '../../navigation/ChefOnboardingNavigator';

type NavigationProp = NativeStackNavigationProp<ChefOnboardingParamList, 'ProfileSetup'>;

interface Props {
  navigation: NavigationProp;
}

export default function ProfileSetupScreen({ navigation }: Props) {
  const { chefProfile, refreshProfile } = useChefOnboarding();

  const [bio, setBio] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [customCuisine, setCustomCuisine] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [serviceRadius, setServiceRadius] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (chefProfile) {
      setBio(chefProfile.bio);
      setSelectedCuisines(chefProfile.cuisineSpecialties);
      setSelectedModels(chefProfile.serviceModels);
      setPriceMin(chefProfile.priceRangeMin > 0 ? String(chefProfile.priceRangeMin) : '');
      setPriceMax(chefProfile.priceRangeMax > 0 ? String(chefProfile.priceRangeMax) : '');
      setServiceRadius(chefProfile.serviceRadius > 0 ? String(chefProfile.serviceRadius) : '');
    }
  }, [chefProfile]);

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine],
    );
  };

  const addCustomCuisine = () => {
    const trimmed = customCuisine.trim();
    if (trimmed && !selectedCuisines.includes(trimmed)) {
      setSelectedCuisines((prev) => [...prev, trimmed]);
      setCustomCuisine('');
    }
  };

  const toggleServiceModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model)
        ? prev.filter((m) => m !== model)
        : [...prev, model],
    );
  };

  const handleSave = async () => {
    if (!chefProfile) return;

    const parsedMin = parseFloat(priceMin);
    const parsedMax = parseFloat(priceMax);
    const parsedRadius = parseFloat(serviceRadius);

    if (parsedMin > 0 && parsedMax > 0 && parsedMax < parsedMin) {
      Alert.alert('Invalid Price', 'Maximum price must be greater than or equal to minimum price.');
      return;
    }

    setIsSaving(true);
    try {
      await updateChefProfile(chefProfile.id, {
        bio: bio.trim(),
        cuisine_specialties: selectedCuisines,
        service_models: selectedModels,
        price_range_min: isNaN(parsedMin) ? 0 : parsedMin,
        price_range_max: isNaN(parsedMax) ? 0 : parsedMax,
        service_radius: isNaN(parsedRadius) ? 0 : parsedRadius,
      });
      await refreshProfile();
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Bio</Text>
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell potential clients about yourself, your experience, and your cooking style..."
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.sectionTitle}>Cuisine Specialties</Text>
        <View style={styles.chipContainer}>
          {CUISINE_OPTIONS.map((cuisine) => (
            <TouchableOpacity
              key={cuisine}
              style={[styles.chip, selectedCuisines.includes(cuisine) && styles.chipSelected]}
              onPress={() => toggleCuisine(cuisine)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.chipText, selectedCuisines.includes(cuisine) && styles.chipTextSelected]}
              >
                {cuisine}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.customCuisineRow}>
          <TextInput
            style={styles.customCuisineInput}
            value={customCuisine}
            onChangeText={setCustomCuisine}
            placeholder="Add custom cuisine..."
            returnKeyType="done"
            onSubmitEditing={addCustomCuisine}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addCustomCuisine}
            disabled={!customCuisine.trim()}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Service Models</Text>
        <TouchableOpacity
          style={[
            styles.modelCard,
            selectedModels.includes(ServiceModel.FULL_SERVICE) && styles.modelCardSelected,
          ]}
          onPress={() => toggleServiceModel(ServiceModel.FULL_SERVICE)}
          activeOpacity={0.7}
        >
          <Text style={styles.modelTitle}>Full Service</Text>
          <Text style={styles.modelDescription}>
            You handle everything — shopping, cooking, serving, and cleanup.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modelCard,
            selectedModels.includes(ServiceModel.COLLABORATIVE) && styles.modelCardSelected,
          ]}
          onPress={() => toggleServiceModel(ServiceModel.COLLABORATIVE)}
          activeOpacity={0.7}
        >
          <Text style={styles.modelTitle}>Collaborative</Text>
          <Text style={styles.modelDescription}>
            Cook together with the client — a hands-on culinary experience.
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Price Range (per person)</Text>
        <View style={styles.priceRow}>
          <View style={styles.priceInputWrapper}>
            <Text style={styles.priceLabel}>Min ($)</Text>
            <TextInput
              style={styles.priceInput}
              value={priceMin}
              onChangeText={setPriceMin}
              placeholder="25"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.priceDash}>—</Text>
          <View style={styles.priceInputWrapper}>
            <Text style={styles.priceLabel}>Max ($)</Text>
            <TextInput
              style={styles.priceInput}
              value={priceMax}
              onChangeText={setPriceMax}
              placeholder="150"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Service Radius (miles)</Text>
        <TextInput
          style={styles.radiusInput}
          value={serviceRadius}
          onChangeText={setServiceRadius}
          placeholder="25"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.7}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 8,
  },
  bioInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    fontSize: 15,
    minHeight: 100,
    color: '#1e293b',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  chipSelected: {
    backgroundColor: '#2563eb',
  },
  chipText: {
    fontSize: 14,
    color: '#475569',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  customCuisineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  customCuisineInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  modelCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 10,
  },
  modelCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  modelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  modelDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInputWrapper: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  priceInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  priceDash: {
    fontSize: 18,
    color: '#94a3b8',
    marginHorizontal: 12,
    marginTop: 16,
  },
  radiusInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    fontSize: 15,
    color: '#1e293b',
    width: 120,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

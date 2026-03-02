import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { ChefTier, CUISINE_OPTIONS, FDA_TOP_9_ALLERGENS } from '../../config/constants';
import { DiscoveryFilters } from '../../models/types';
import CuisineChip from './CuisineChip';

interface FilterPanelProps {
  visible: boolean;
  filters: DiscoveryFilters;
  onApply: (filters: DiscoveryFilters) => void;
  onReset: () => void;
  onClose: () => void;
}

export default function FilterPanel({
  visible,
  filters,
  onApply,
  onReset,
  onClose,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<DiscoveryFilters>(filters);

  React.useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [visible, filters]);

  const toggleCuisine = (cuisine: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter((c) => c !== cuisine)
        : [...prev.cuisines, cuisine],
    }));
  };

  const toggleDietary = (restriction: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter((r) => r !== restriction)
        : [...prev.dietaryRestrictions, restriction],
    }));
  };

  const setTier = (tier: ChefTier | null) => {
    setLocalFilters((prev) => ({
      ...prev,
      tier: prev.tier === tier ? null : tier,
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Cuisine</Text>
          <View style={styles.chipGrid}>
            {CUISINE_OPTIONS.map((cuisine) => (
              <CuisineChip
                key={cuisine}
                label={cuisine}
                selected={localFilters.cuisines.includes(cuisine)}
                onToggle={toggleCuisine}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Budget Range (per person)</Text>
          <View style={styles.budgetRow}>
            <View style={styles.budgetInput}>
              <Text style={styles.budgetLabel}>Min $</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={localFilters.budgetMin?.toString() ?? ''}
                onChangeText={(val) => {
                  const num = parseInt(val, 10);
                  setLocalFilters((prev) => ({
                    ...prev,
                    budgetMin: isNaN(num) ? null : num,
                  }));
                }}
                placeholder="0"
              />
            </View>
            <Text style={styles.budgetDash}>–</Text>
            <View style={styles.budgetInput}>
              <Text style={styles.budgetLabel}>Max $</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={localFilters.budgetMax?.toString() ?? ''}
                onChangeText={(val) => {
                  const num = parseInt(val, 10);
                  setLocalFilters((prev) => ({
                    ...prev,
                    budgetMax: isNaN(num) ? null : num,
                  }));
                }}
                placeholder="500"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Chef Type</Text>
          <View style={styles.tierRow}>
            <TouchableOpacity
              style={[
                styles.tierButton,
                localFilters.tier === ChefTier.CLASSICALLY_TRAINED && styles.tierButtonSelected,
              ]}
              onPress={() => setTier(ChefTier.CLASSICALLY_TRAINED)}
            >
              <Text
                style={[
                  styles.tierButtonText,
                  localFilters.tier === ChefTier.CLASSICALLY_TRAINED && styles.tierButtonTextSelected,
                ]}
              >
                Classically Trained
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tierButton,
                localFilters.tier === ChefTier.HOME_CHEF && styles.tierButtonSelected,
              ]}
              onPress={() => setTier(ChefTier.HOME_CHEF)}
            >
              <Text
                style={[
                  styles.tierButtonText,
                  localFilters.tier === ChefTier.HOME_CHEF && styles.tierButtonTextSelected,
                ]}
              >
                Home Chef
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
          <View style={styles.chipGrid}>
            {FDA_TOP_9_ALLERGENS.map((allergen) => (
              <CuisineChip
                key={allergen}
                label={allergen}
                selected={localFilters.dietaryRestrictions.includes(allergen)}
                onToggle={toggleDietary}
              />
            ))}
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cancelText: {
    fontSize: 16,
    color: '#6b7280',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  resetText: {
    fontSize: 16,
    color: '#f97316',
    fontWeight: '600',
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 12,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetInput: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  budgetDash: {
    fontSize: 20,
    color: '#9ca3af',
    marginHorizontal: 12,
    marginTop: 16,
  },
  tierRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tierButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    alignItems: 'center',
  },
  tierButtonSelected: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  tierButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  tierButtonTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  spacer: {
    height: 32,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  applyButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

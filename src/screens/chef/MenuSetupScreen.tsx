import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChefOnboarding } from '../../hooks/use-chef-onboarding';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/menu-service';
import { FDA_TOP_9_ALLERGENS } from '../../config/constants';
import { MenuItem } from '../../models/types';
import { ChefOnboardingParamList } from '../../navigation/ChefOnboardingNavigator';

type NavigationProp = NativeStackNavigationProp<ChefOnboardingParamList, 'MenuSetup'>;

interface Props {
  navigation: NavigationProp;
}

interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  allergens: string[];
}

const EMPTY_FORM: MenuItemFormData = {
  name: '',
  description: '',
  price: '',
  allergens: [],
};

export default function MenuSetupScreen({ navigation }: Props) {
  const { chefProfile, menuItems, refreshMenu } = useChefOnboarding();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<MenuItemFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const toggleAllergen = (allergen: string) => {
    setForm((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      allergens: item.allergens,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!chefProfile) return;

    const trimmedName = form.name.trim();
    const parsedPrice = parseFloat(form.price);

    if (!trimmedName) {
      Alert.alert('Required', 'Please enter a dish name.');
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Required', 'Please enter a valid price.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updateMenuItem(editingId, {
          name: trimmedName,
          description: form.description.trim(),
          price: parsedPrice,
          allergens: form.allergens,
        });
      } else {
        await createMenuItem({
          chef_id: chefProfile.id,
          name: trimmedName,
          description: form.description.trim(),
          price: parsedPrice,
          allergens: form.allergens,
        });
      }
      await refreshMenu();
      handleCancel();
    } catch {
      Alert.alert('Error', 'Failed to save menu item. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (item: MenuItem) => {
    Alert.alert('Delete Item', `Remove "${item.name}" from your menu?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMenuItem(item.id);
            await refreshMenu();
            if (editingId === item.id) handleCancel();
          } catch {
            Alert.alert('Error', 'Failed to delete item. Please try again.');
          }
        },
      },
    ]);
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.itemCard}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => handleEdit(item)}
        activeOpacity={0.7}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        </View>
        {item.description ? (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        {item.allergens.length > 0 && (
          <View style={styles.allergenRow}>
            {item.allergens.map((a) => (
              <View key={a} style={styles.allergenBadge}>
                <Text style={styles.allergenBadgeText}>{a}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteItemButton}
        onPress={() => handleDelete(item)}
      >
        <Text style={styles.deleteItemText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No menu items yet. Add your first dish!</Text>
          }
          ListHeaderComponent={
            showForm ? (
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>
                  {editingId ? 'Edit Item' : 'New Item'}
                </Text>
                <TextInput
                  style={styles.input}
                  value={form.name}
                  onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
                  placeholder="Dish name"
                />
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  value={form.description}
                  onChangeText={(t) => setForm((f) => ({ ...f, description: t }))}
                  placeholder="Description (optional)"
                  multiline
                  textAlignVertical="top"
                />
                <TextInput
                  style={styles.input}
                  value={form.price}
                  onChangeText={(t) => setForm((f) => ({ ...f, price: t }))}
                  placeholder="Price per person ($)"
                  keyboardType="numeric"
                />

                <Text style={styles.allergenTitle}>Allergens (FDA Top 9)</Text>
                <View style={styles.allergenContainer}>
                  {FDA_TOP_9_ALLERGENS.map((allergen) => (
                    <TouchableOpacity
                      key={allergen}
                      style={[
                        styles.allergenChip,
                        form.allergens.includes(allergen) && styles.allergenChipSelected,
                      ]}
                      onPress={() => toggleAllergen(allergen)}
                    >
                      <Text
                        style={[
                          styles.allergenChipText,
                          form.allergens.includes(allergen) && styles.allergenChipTextSelected,
                        ]}
                      >
                        {allergen}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.formButtons}>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveItemButton}
                    onPress={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.saveItemText}>
                        {editingId ? 'Update' : 'Add'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          }
        />

        {!showForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddNew}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>Add Menu Item</Text>
          </TouchableOpacity>
        )}
      </View>
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
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 15,
    marginTop: 40,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    marginLeft: 8,
  },
  itemDescription: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  allergenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  allergenBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  allergenBadgeText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '500',
  },
  deleteItemButton: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingVertical: 10,
    alignItems: 'center',
  },
  deleteItemText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 10,
  },
  descriptionInput: {
    minHeight: 60,
  },
  allergenTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 4,
    marginBottom: 8,
  },
  allergenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  allergenChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  allergenChipSelected: {
    backgroundColor: '#fef2f2',
    borderColor: '#dc2626',
  },
  allergenChipText: {
    fontSize: 12,
    color: '#64748b',
  },
  allergenChipTextSelected: {
    color: '#dc2626',
    fontWeight: '600',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
  saveItemButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  saveItemText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

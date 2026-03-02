import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FDA_TOP_9_ALLERGENS, CUISINE_OPTIONS } from '../../config/constants';
import { ConsumerProfile, Booking } from '../../models/types';
import { useAuth } from '../../hooks/use-auth';
import { getConsumerProfile, updateConsumerProfile } from '../../services/consumer-profile-service';
import { getBookingsForConsumer } from '../../services/booking-service';

type ProfileStackParamList = {
  ConsumerProfile: undefined;
  BookingDetail: { bookingId: string };
};

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'Kosher',
  'Dairy-Free',
] as const;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  confirmed: { bg: '#dbeafe', text: '#1e40af' },
  completed: { bg: '#d1fae5', text: '#065f46' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

export default function ConsumerProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [profile, setProfile] = useState<ConsumerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [allergies, setAllergies] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [preferredCuisines, setPreferredCuisines] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [p, b] = await Promise.all([
        getConsumerProfile(user.id),
        getBookingsForConsumer(user.id),
      ]);
      setProfile(p);
      setAllergies(p.allergies);
      setDietaryRestrictions(p.dietaryRestrictions);
      setPreferredCuisines(p.preferredCuisines);
      setBookings(b);
    } catch {
      // User sees empty state
    }
  }, [user]);

  useEffect(() => {
    fetchData().finally(() => setIsLoading(false));
  }, [fetchData]);

  const toggleItem = (
    list: string[],
    setList: (v: string[]) => void,
    item: string,
  ) => {
    setList(
      list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item],
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateConsumerProfile(user.id, {
        allergies,
        dietary_restrictions: dietaryRestrictions,
        preferred_cuisines: preferredCuisines,
      });
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch {
      // Handled in context
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Profile</Text>
      <Text style={styles.name}>{user?.displayName}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <Text style={styles.sectionTitle}>Allergies</Text>
      <View style={styles.chipRow}>
        {FDA_TOP_9_ALLERGENS.map((allergen) => {
          const selected = allergies.includes(allergen);
          return (
            <TouchableOpacity
              key={allergen}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => toggleItem(allergies, setAllergies, allergen)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {allergen}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
      <View style={styles.chipRow}>
        {DIETARY_OPTIONS.map((diet) => {
          const selected = dietaryRestrictions.includes(diet);
          return (
            <TouchableOpacity
              key={diet}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => toggleItem(dietaryRestrictions, setDietaryRestrictions, diet)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {diet}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Preferred Cuisines</Text>
      <View style={styles.chipRow}>
        {CUISINE_OPTIONS.map((cuisine) => {
          const selected = preferredCuisines.includes(cuisine);
          return (
            <TouchableOpacity
              key={cuisine}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => toggleItem(preferredCuisines, setPreferredCuisines, cuisine)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {cuisine}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.disabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {bookings.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Booking History</Text>
          {bookings.map((booking) => {
            const statusColor = STATUS_COLORS[booking.status] ?? STATUS_COLORS.pending;
            return (
              <TouchableOpacity
                key={booking.id}
                style={styles.bookingRow}
                onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.id })}
              >
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingDate}>{booking.eventDate.split('T')[0]}</Text>
                  <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
                    <Text style={[styles.badgeText, { color: statusColor.text }]}>
                      {booking.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.bookingMeta}>
                  {booking.partySize} guests · {booking.occasion || 'No occasion'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </>
      )}

      <TouchableOpacity
        style={[styles.signOutButton, isSigningOut && styles.disabled]}
        onPress={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <ActivityIndicator color="#dc2626" />
        ) : (
          <Text style={styles.signOutText}>Sign Out</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    color: '#374151',
    fontWeight: '600',
  },
  email: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipSelected: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  chipText: {
    fontSize: 13,
    color: '#374151',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#f97316',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  disabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bookingRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bookingMeta: {
    fontSize: 14,
    color: '#6b7280',
  },
  signOutButton: {
    marginTop: 32,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
});

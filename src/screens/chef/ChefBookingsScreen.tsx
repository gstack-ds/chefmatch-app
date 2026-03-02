import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BookingStatus } from '../../config/constants';
import { Booking } from '../../models/types';
import { useChefOnboarding } from '../../hooks/use-chef-onboarding';
import { getBookingsForChef } from '../../services/booking-service';

export type ChefBookingsStackParamList = {
  ChefBookings: undefined;
  ChefBookingDetail: { bookingId: string };
};

const STATUS_ORDER: Record<string, number> = {
  [BookingStatus.PENDING]: 0,
  [BookingStatus.CONFIRMED]: 1,
  [BookingStatus.COMPLETED]: 2,
  [BookingStatus.CANCELLED]: 3,
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  confirmed: { bg: '#dbeafe', text: '#1e40af' },
  completed: { bg: '#d1fae5', text: '#065f46' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

export default function ChefBookingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ChefBookingsStackParamList>>();
  const { chefProfile } = useChefOnboarding();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!chefProfile) return;
    try {
      const data = await getBookingsForChef(chefProfile.id);
      data.sort((a, b) => (STATUS_ORDER[a.status] ?? 4) - (STATUS_ORDER[b.status] ?? 4));
      setBookings(data);
    } catch {
      // Silently handle — user sees empty list
    }
  }, [chefProfile]);

  useEffect(() => {
    fetchBookings().finally(() => setIsLoading(false));
  }, [fetchBookings]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBookings();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bookings yet</Text>
        }
        renderItem={({ item }) => {
          const statusColor = STATUS_COLORS[item.status] ?? STATUS_COLORS.pending;
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                navigation.navigate('ChefBookingDetail', { bookingId: item.id })
              }
            >
              <View style={styles.rowHeader}>
                <Text style={styles.rowDate}>{item.eventDate.split('T')[0]}</Text>
                <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
                  <Text style={[styles.badgeText, { color: statusColor.text }]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.rowMeta}>
                {item.partySize} guests · {item.occasion || 'No occasion'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 40,
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  rowDate: {
    fontSize: 16,
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
  rowMeta: {
    fontSize: 14,
    color: '#6b7280',
  },
});

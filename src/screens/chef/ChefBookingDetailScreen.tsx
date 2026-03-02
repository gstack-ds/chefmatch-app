import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BookingStatus } from '../../config/constants';
import { Booking } from '../../models/types';
import { useAuth } from '../../hooks/use-auth';
import { getBooking, updateBookingStatus } from '../../services/booking-service';

type ChefBookingDetailParams = {
  ChefBookingDetail: { bookingId: string };
};

type ChefBookingDetailRouteProp = RouteProp<ChefBookingDetailParams, 'ChefBookingDetail'>;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  confirmed: { bg: '#dbeafe', text: '#1e40af' },
  completed: { bg: '#d1fae5', text: '#065f46' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

type WriteReviewNav = NativeStackNavigationProp<{
  WriteReview: { bookingId: string; reviewerId: string; revieweeId: string; revieweeName: string };
}>;

export default function ChefBookingDetailScreen() {
  const route = useRoute<ChefBookingDetailRouteProp>();
  const navigation = useNavigation<WriteReviewNav>();
  const { user } = useAuth();
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    getBooking(bookingId)
      .then(setBooking)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [bookingId]);

  const handleStatusUpdate = async (newStatus: BookingStatus, label: string) => {
    Alert.alert(`${label} Booking`, `Are you sure you want to ${label.toLowerCase()} this booking?`, [
      { text: 'No', style: 'cancel' },
      {
        text: `Yes, ${label}`,
        onPress: async () => {
          setIsUpdating(true);
          try {
            await updateBookingStatus(bookingId, newStatus);
            setBooking((prev) => (prev ? { ...prev, status: newStatus } : prev));
          } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update');
          } finally {
            setIsUpdating(false);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  const statusColor = STATUS_COLORS[booking.status] ?? STATUS_COLORS.pending;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
        <Text style={[styles.statusText, { color: statusColor.text }]}>
          {booking.status.toUpperCase()}
        </Text>
      </View>

      <InfoRow label="Event Date" value={booking.eventDate} />
      <InfoRow label="Party Size" value={`${booking.partySize} guests`} />
      <InfoRow label="Occasion" value={booking.occasion || 'Not specified'} />
      <InfoRow label="Service Model" value={booking.serviceModel.replace('_', ' ')} />
      <InfoRow label="Grocery Arrangement" value={booking.groceryArrangement.replace('_', ' ')} />
      {booking.locationAddress && (
        <InfoRow label="Location" value={booking.locationAddress} />
      )}
      {booking.specialRequests.length > 0 && (
        <InfoRow label="Special Requests" value={booking.specialRequests} />
      )}

      {booking.status === BookingStatus.COMPLETED && user && (
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() =>
            navigation.navigate('WriteReview', {
              bookingId: booking.id,
              reviewerId: user.id,
              revieweeId: booking.consumerId,
              revieweeName: 'Guest',
            })
          }
        >
          <Text style={styles.reviewButtonText}>Leave a Review</Text>
        </TouchableOpacity>
      )}

      {booking.status === BookingStatus.PENDING && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.acceptButton, isUpdating && styles.disabled]}
            onPress={() => handleStatusUpdate(BookingStatus.CONFIRMED, 'Accept')}
            disabled={isUpdating}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.declineButton, isUpdating && styles.disabled]}
            onPress={() => handleStatusUpdate(BookingStatus.CANCELLED, 'Decline')}
            disabled={isUpdating}
          >
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2937',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  declineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  declineText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  reviewButton: {
    backgroundColor: '#f97316',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

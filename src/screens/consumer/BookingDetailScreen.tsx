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
import { RouteProp, useRoute } from '@react-navigation/native';
import { BookingStatus } from '../../config/constants';
import { Booking } from '../../models/types';
import { getBooking, updateBookingStatus } from '../../services/booking-service';

type BookingDetailParams = {
  BookingDetail: { bookingId: string };
};

type BookingDetailRouteProp = RouteProp<BookingDetailParams, 'BookingDetail'>;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  confirmed: { bg: '#dbeafe', text: '#1e40af' },
  completed: { bg: '#d1fae5', text: '#065f46' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

export default function BookingDetailScreen() {
  const route = useRoute<BookingDetailRouteProp>();
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    getBooking(bookingId)
      .then(setBooking)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [bookingId]);

  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          setIsCancelling(true);
          try {
            await updateBookingStatus(bookingId, BookingStatus.CANCELLED);
            setBooking((prev) =>
              prev ? { ...prev, status: BookingStatus.CANCELLED } : prev,
            );
          } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to cancel');
          } finally {
            setIsCancelling(false);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
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
      {booking.totalPrice !== null && (
        <InfoRow label="Total Price" value={`$${booking.totalPrice}`} />
      )}

      {booking.status === BookingStatus.PENDING && (
        <TouchableOpacity
          style={[styles.cancelButton, isCancelling && styles.disabled]}
          onPress={handleCancel}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <ActivityIndicator color="#dc2626" />
          ) : (
            <Text style={styles.cancelText}>Cancel Booking</Text>
          )}
        </TouchableOpacity>
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
  cancelButton: {
    marginTop: 28,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 12,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  cancelText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
});

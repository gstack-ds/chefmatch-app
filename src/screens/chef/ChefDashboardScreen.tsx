import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ChefTier, BookingStatus } from '../../config/constants';
import { Booking, Review } from '../../models/types';
import { useAuth } from '../../hooks/use-auth';
import { useChefOnboarding } from '../../hooks/use-chef-onboarding';
import { getBookingsForChef } from '../../services/booking-service';
import { getReviewsForUser } from '../../services/review-service';

type RootParamList = {
  ChefBookingsTab: { screen: string; params: { bookingId: string } };
};

export default function ChefDashboardScreen() {
  const navigation = useNavigation<NavigationProp<RootParamList>>();
  const { user, signOut } = useAuth();
  const { chefProfile, menuItems, availability } = useChefOnboarding();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const fetchData = useCallback(async () => {
    if (!chefProfile || !user) return;
    try {
      const [b, r] = await Promise.all([
        getBookingsForChef(user.id),
        getReviewsForUser(user.id),
      ]);
      setBookings(b);
      setReviews(r);
    } catch {
      // User sees empty sections
    }
  }, [chefProfile, user]);

  useEffect(() => {
    fetchData().finally(() => setIsLoading(false));
  }, [fetchData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
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

  const pendingBookings = bookings.filter((b) => b.status === BookingStatus.PENDING);
  const confirmedBookings = bookings.filter((b) => b.status === BookingStatus.CONFIRMED);
  const recentReviews = reviews.slice(0, 3);

  const tierLabel = chefProfile?.tier === ChefTier.CLASSICALLY_TRAINED
    ? 'Classically Trained'
    : 'Home Chef';

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.liveBadge}>
          <Text style={styles.liveDot}>{'\u25CF'}</Text>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <Text style={styles.name}>{user?.displayName}</Text>
        <View style={styles.tierTag}>
          <Text style={styles.tierText}>{tierLabel}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{chefProfile?.completedEvents ?? 0}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {chefProfile?.averageRating?.toFixed(1) ?? '—'}
          </Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{chefProfile?.totalReviews ?? 0}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{menuItems.length}</Text>
          <Text style={styles.statLabel}>Menu</Text>
        </View>
      </View>

      {pendingBookings.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            Pending Requests ({pendingBookings.length})
          </Text>
          {pendingBookings.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={styles.bookingRow}
              onPress={() => navigation.navigate('ChefBookingsTab', {
                screen: 'ChefBookingDetail',
                params: { bookingId: b.id },
              })}
            >
              <Text style={styles.bookingDate}>{b.eventDate.split('T')[0]}</Text>
              <Text style={styles.bookingMeta}>
                {b.partySize} guests · {b.occasion || 'No occasion'}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {confirmedBookings.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            Upcoming Events ({confirmedBookings.length})
          </Text>
          {confirmedBookings.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={styles.bookingRow}
              onPress={() => navigation.navigate('ChefBookingsTab', {
                screen: 'ChefBookingDetail',
                params: { bookingId: b.id },
              })}
            >
              <Text style={styles.bookingDate}>{b.eventDate.split('T')[0]}</Text>
              <Text style={styles.bookingMeta}>
                {b.partySize} guests · {b.occasion || 'No occasion'}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {recentReviews.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {recentReviews.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.stars}>
                  {Array.from({ length: 5 }, (_, i) =>
                    i < r.rating ? '\u2605' : '\u2606',
                  ).join('')}
                </Text>
                <Text style={styles.reviewDate}>{r.createdAt.split('T')[0]}</Text>
              </View>
              {r.text.length > 0 && (
                <Text style={styles.reviewText} numberOfLines={2}>
                  {r.text}
                </Text>
              )}
            </View>
          ))}
        </>
      )}

      {pendingBookings.length === 0 && confirmedBookings.length === 0 && recentReviews.length === 0 && (
        <Text style={styles.emptyText}>
          No bookings or reviews yet. Consumers can now discover your profile!
        </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 12,
  },
  liveDot: {
    color: '#22c55e',
    fontSize: 10,
    marginRight: 6,
  },
  liveText: {
    color: '#16a34a',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  tierTag: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 10,
  },
  bookingRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  bookingDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  bookingMeta: {
    fontSize: 14,
    color: '#6b7280',
  },
  reviewCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stars: {
    fontSize: 16,
    color: '#f97316',
  },
  reviewDate: {
    fontSize: 13,
    color: '#9ca3af',
  },
  reviewText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 15,
    marginTop: 40,
    lineHeight: 22,
  },
  signOutButton: {
    marginTop: 32,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 12,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  signOutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
});

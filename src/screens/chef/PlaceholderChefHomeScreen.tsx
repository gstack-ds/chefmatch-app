import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/use-auth';
import { useChefOnboarding } from '../../hooks/use-chef-onboarding';
import { ChefTier } from '../../config/constants';

export default function PlaceholderChefHomeScreen() {
  const { user, signOut } = useAuth();
  const { chefProfile, menuItems, availability } = useChefOnboarding();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch {
      // Error handled in context
    } finally {
      setIsSigningOut(false);
    }
  };

  const tierLabel = chefProfile?.tier === ChefTier.CLASSICALLY_TRAINED
    ? 'Classically Trained'
    : 'Home Chef';

  return (
    <View style={styles.container}>
      <View style={styles.liveBadge}>
        <Text style={styles.liveDot}>●</Text>
        <Text style={styles.liveText}>LIVE</Text>
      </View>

      <Text style={styles.title}>You're Live!</Text>
      <Text style={styles.name}>{user?.displayName}</Text>

      <View style={styles.tierTag}>
        <Text style={styles.tierText}>{tierLabel}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{chefProfile?.cuisineSpecialties.length ?? 0}</Text>
          <Text style={styles.statLabel}>Cuisines</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{menuItems.length}</Text>
          <Text style={styles.statLabel}>Menu Items</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{availability.length}</Text>
          <Text style={styles.statLabel}>Time Slots</Text>
        </View>
      </View>

      {chefProfile && (
        <Text style={styles.priceRange}>
          ${chefProfile.priceRangeMin}–${chefProfile.priceRangeMax} per person
        </Text>
      )}

      <Text style={styles.subtitle}>
        Consumers can now discover your profile. Bookings and messaging coming soon!
      </Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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
    marginBottom: 16,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    color: '#4b5563',
    marginBottom: 12,
  },
  tierTag: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 24,
  },
  tierText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  priceRange: {
    fontSize: 15,
    color: '#f97316',
    fontWeight: '600',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  signOutButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.6,
  },
  signOutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
});

import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { DiscoverableChef } from '../../models/types';
import { ChefTier } from '../../config/constants';
import TierBadge from './TierBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CARD_WIDTH = SCREEN_WIDTH - 32;
export const CARD_HEIGHT = CARD_WIDTH * 1.3;

interface SwipeCardProps {
  chef: DiscoverableChef;
  conflicts: string[];
  onPress: () => void;
}

export default function SwipeCard({ chef, conflicts, onPress }: SwipeCardProps) {
  const photoUri = chef.photos.length > 0 ? chef.photos[0] : null;
  const priceLabel = `$${chef.priceRangeMin}–$${chef.priceRangeMax}`;
  const ratingLabel = chef.averageRating
    ? `${chef.averageRating.toFixed(1)} (${chef.totalReviews})`
    : 'New';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <ImageBackground
        source={photoUri ? { uri: photoUri } : undefined}
        style={styles.image}
        imageStyle={styles.imageRounded}
      >
        {!photoUri && (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {chef.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.gradient}>
          {conflicts.length > 0 && (
            <View style={styles.allergenTag}>
              <Text style={styles.allergenTagText}>Allergen Alert</Text>
            </View>
          )}

          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {chef.displayName}
              </Text>
              <TierBadge tier={chef.tier as ChefTier} />
            </View>

            <Text style={styles.cuisines} numberOfLines={1}>
              {chef.cuisineSpecialties.join(' · ')}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.price}>{priceLabel}</Text>
              <Text style={styles.rating}>{ratingLabel}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageRounded: {
    borderRadius: 16,
  },
  placeholderImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#d1d5db',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  gradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  allergenTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  allergenTagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  infoContainer: {},
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flexShrink: 1,
  },
  cuisines: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  rating: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
});

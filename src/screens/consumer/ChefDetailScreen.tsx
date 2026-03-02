import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChefTier, SwipeDirection } from '../../config/constants';
import { MenuItem, DiscoverableChef } from '../../models/types';
import { getMenuItems } from '../../services/menu-service';
import { useDiscovery } from '../../hooks/use-discovery';
import TierBadge from '../../components/consumer/TierBadge';
import AllergenWarningBanner from '../../components/consumer/AllergenWarningBanner';
import ActionButtons from '../../components/consumer/ActionButtons';

type ChefDetailRouteProp = RouteProp<
  { ChefDetail: { chef: DiscoverableChef } },
  'ChefDetail'
>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ParentNavProp = NativeStackNavigationProp<{
  BookingRequest: { chefId: string; chefName: string; conversationId: string | null };
}>;

export default function ChefDetailScreen() {
  const route = useRoute<ChefDetailRouteProp>();
  const navigation = useNavigation<ParentNavProp>();
  const { chef } = route.params;
  const { handleSwipe, getConflicts } = useDiscovery();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  const conflicts = getConflicts(chef);

  useEffect(() => {
    getMenuItems(chef.id)
      .then(setMenuItems)
      .catch(() => {})
      .finally(() => setIsLoadingMenu(false));
  }, [chef.id]);

  const ratingLabel = chef.averageRating
    ? `${chef.averageRating.toFixed(1)} (${chef.totalReviews} reviews)`
    : 'New chef — no reviews yet';

  const priceLabel = `$${chef.priceRangeMin}–$${chef.priceRangeMax} per person`;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {chef.photos.length > 0 ? (
          <FlatList
            data={chef.photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, i) => `${item}-${i}`}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.photo} />
            )}
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>
              {chef.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.content}>
          <AllergenWarningBanner conflicts={conflicts} />

          <View style={styles.nameRow}>
            <Text style={styles.name}>{chef.displayName}</Text>
            <TierBadge tier={chef.tier as ChefTier} size="medium" />
          </View>

          <Text style={styles.meta}>{ratingLabel}</Text>
          <Text style={styles.meta}>{priceLabel}</Text>

          <View style={styles.cuisineRow}>
            {chef.cuisineSpecialties.map((c) => (
              <View key={c} style={styles.cuisineTag}>
                <Text style={styles.cuisineTagText}>{c}</Text>
              </View>
            ))}
          </View>

          {chef.bio.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{chef.bio}</Text>
            </>
          )}

          <Text style={styles.sectionTitle}>Menu</Text>
          {isLoadingMenu ? (
            <ActivityIndicator size="small" color="#f97316" style={styles.menuLoader} />
          ) : menuItems.length === 0 ? (
            <Text style={styles.emptyMenu}>No menu items yet.</Text>
          ) : (
            menuItems.map((item) => (
              <View key={item.id} style={styles.menuItem}>
                <View style={styles.menuItemHeader}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemPrice}>${item.price}</Text>
                </View>
                {item.description.length > 0 && (
                  <Text style={styles.menuItemDesc}>{item.description}</Text>
                )}
                {item.allergens.length > 0 && (
                  <Text style={styles.menuItemAllergens}>
                    Contains: {item.allergens.join(', ')}
                  </Text>
                )}
              </View>
            ))
          )}

          {chef.allergensCantAccommodate.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Cannot Accommodate</Text>
              <View style={styles.allergenRow}>
                {chef.allergensCantAccommodate.map((a) => (
                  <View key={a} style={styles.allergenTag}>
                    <Text style={styles.allergenTagText}>{a}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={styles.spacer} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            navigation.navigate('BookingRequest', {
              chefId: chef.id,
              chefName: chef.displayName,
              conversationId: null,
            })
          }
        >
          <Text style={styles.bookButtonText}>Request Booking</Text>
        </TouchableOpacity>
        <ActionButtons
          onPass={() => handleSwipe(chef.id, SwipeDirection.PASS)}
          onLike={() => handleSwipe(chef.id, SwipeDirection.LIKE)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  photo: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
  },
  photoPlaceholder: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    flexShrink: 1,
  },
  meta: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 4,
  },
  cuisineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 8,
  },
  cuisineTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  cuisineTagText: {
    fontSize: 13,
    color: '#374151',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 10,
  },
  bio: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
  menuLoader: {
    marginVertical: 16,
  },
  emptyMenu: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f97316',
    marginLeft: 8,
  },
  menuItemDesc: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    lineHeight: 19,
  },
  menuItemAllergens: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  allergenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergenTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fef2f2',
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  allergenTagText: {
    fontSize: 13,
    color: '#dc2626',
  },
  spacer: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  bookButton: {
    backgroundColor: '#2563eb',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

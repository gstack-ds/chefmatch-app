import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SwipeDirection } from '../../config/constants';
import { DiscoverableChef } from '../../models/types';
import { useDiscovery } from '../../hooks/use-discovery';
import SwipeCardStack from '../../components/consumer/SwipeCardStack';
import ActionButtons from '../../components/consumer/ActionButtons';
import FilterPanel from '../../components/consumer/FilterPanel';

export type DiscoveryStackParamList = {
  DiscoveryFeed: undefined;
  ChefDetail: { chef: DiscoverableChef };
};

type NavigationProp = NativeStackNavigationProp<DiscoveryStackParamList, 'DiscoveryFeed'>;

export default function DiscoveryFeedScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    chefs,
    isLoading,
    error,
    filters,
    setFilters,
    resetFilters,
    activeFilterCount,
    handleSwipe,
    refreshFeed,
    getConflicts,
    isEmpty,
  } = useDiscovery();

  const [filterVisible, setFilterVisible] = useState(false);

  const topChef = chefs.length > 0 ? chefs[0] : null;

  const onSwipe = (chefId: string, direction: SwipeDirection) => {
    handleSwipe(chefId, direction);
  };

  const onCardPress = (chef: DiscoverableChef) => {
    navigation.navigate('ChefDetail', { chef });
  };

  const onPass = () => {
    if (topChef) handleSwipe(topChef.id, SwipeDirection.PASS);
  };

  const onLike = () => {
    if (topChef) handleSwipe(topChef.id, SwipeDirection.LIKE);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Finding chefs near you...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshFeed}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={styles.filterIcon}>☰</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No chefs found</Text>
          <Text style={styles.emptySubtitle}>
            {activeFilterCount > 0
              ? 'Try adjusting your filters to see more chefs.'
              : "You've seen all available chefs. Check back later!"}
          </Text>
          {activeFilterCount > 0 && (
            <TouchableOpacity style={styles.clearFiltersButton} onPress={resetFilters}>
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          <View style={styles.cardArea}>
            <SwipeCardStack
              chefs={chefs}
              onSwipe={onSwipe}
              onCardPress={onCardPress}
              getConflicts={getConflicts}
            />
          </View>
          <ActionButtons onPass={onPass} onLike={onLike} />
        </>
      )}

      <FilterPanel
        visible={filterVisible}
        filters={filters}
        onApply={setFilters}
        onReset={resetFilters}
        onClose={() => setFilterVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  centered: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterIcon: {
    fontSize: 20,
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#f97316',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  clearFiltersButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#f97316',
    borderRadius: 10,
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#f97316',
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

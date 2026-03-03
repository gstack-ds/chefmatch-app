import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { SwipeDirection } from '../config/constants';
import { ConsumerProfile, DiscoverableChef, DiscoveryFilters } from '../models/types';
import { useAuth } from './use-auth';
import { getConsumerProfile } from '../services/consumer-profile-service';
import { recordSwipe, getSwipedChefIds } from '../services/swipe-service';
import {
  fetchDiscoverableChefs,
  detectAllergenConflicts,
  countActiveFilters,
} from '../services/discovery-service';

const DEFAULT_FILTERS: DiscoveryFilters = {
  cuisines: [],
  budgetMin: null,
  budgetMax: null,
  tier: null,
  dietaryRestrictions: [],
};

const AUTO_LOAD_THRESHOLD = 5;

interface DiscoveryContextValue {
  chefs: DiscoverableChef[];
  consumerProfile: ConsumerProfile | null;
  isLoading: boolean;
  error: string | null;
  filters: DiscoveryFilters;
  setFilters: (filters: DiscoveryFilters) => void;
  resetFilters: () => void;
  activeFilterCount: number;
  handleSwipe: (chefId: string, direction: SwipeDirection) => Promise<void>;
  loadMore: () => Promise<void>;
  refreshFeed: () => Promise<void>;
  getConflicts: (chef: DiscoverableChef) => string[];
  hasMore: boolean;
  isLoadingMore: boolean;
  isEmpty: boolean;
}

const DiscoveryContext = createContext<DiscoveryContextValue | undefined>(undefined);

export function DiscoveryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [consumerProfile, setConsumerProfile] = useState<ConsumerProfile | null>(null);
  const [chefs, setChefs] = useState<DiscoverableChef[]>([]);
  const [swipedIds, setSwipedIds] = useState<string[]>([]);
  const [filters, setFiltersState] = useState<DiscoveryFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);

  const loadChefs = useCallback(async (
    excludeIds: string[],
    currentFilters: DiscoveryFilters,
    offset: number,
  ) => {
    const newChefs = await fetchDiscoverableChefs(excludeIds, currentFilters, offset);
    if (newChefs.length < 20) {
      setHasMore(false);
    }
    return newChefs;
  }, []);

  const initializeFeed = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const profile = await getConsumerProfile(user.id);
      setConsumerProfile(profile);

      const existingIds = await getSwipedChefIds(user.id);
      setSwipedIds(existingIds);

      offsetRef.current = 0;
      setHasMore(true);
      const initialChefs = await loadChefs(existingIds, filters, 0);
      setChefs(initialChefs);
      offsetRef.current = initialChefs.length;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load discovery feed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user, filters, loadChefs]);

  useEffect(() => {
    initializeFeed();
  }, [initializeFeed]);

  const handleSwipe = useCallback(async (chefId: string, direction: SwipeDirection) => {
    if (!consumerProfile || !user) return;

    // Find the chef to get their userId for the DB insert
    const chef = chefs.find((c) => c.id === chefId);
    const chefUserId = chef?.userId ?? chefId;

    // Optimistic remove
    setChefs((prev) => prev.filter((c) => c.id !== chefId));
    setSwipedIds((prev) => [...prev, chefUserId]);

    try {
      await recordSwipe(user.id, chefUserId, direction);
    } catch (err) {
      // Revert on failure
      setChefs((prev) => {
        return chef ? [chef, ...prev] : prev;
      });
      setSwipedIds((prev) => prev.filter((id) => id !== chefUserId));
      const message = err instanceof Error ? err.message : 'Failed to record swipe';
      setError(message);
      return;
    }

    // Auto-load more when running low
    const remainingCount = chefs.length - 1; // -1 for the one we just removed
    if (remainingCount < AUTO_LOAD_THRESHOLD && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [user, consumerProfile, chefs, hasMore, isLoadingMore]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !consumerProfile) return;

    setIsLoadingMore(true);
    try {
      const allExcluded = [...swipedIds, ...chefs.map((c) => c.userId)];
      const moreChefs = await loadChefs(allExcluded, filters, offsetRef.current);
      setChefs((prev) => [...prev, ...moreChefs]);
      offsetRef.current += moreChefs.length;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load more chefs';
      setError(message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, consumerProfile, swipedIds, chefs, filters, loadChefs]);

  const setFilters = useCallback((newFilters: DiscoveryFilters) => {
    setFiltersState(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const refreshFeed = useCallback(async () => {
    await initializeFeed();
  }, [initializeFeed]);

  const getConflicts = useCallback((chef: DiscoverableChef): string[] => {
    if (!consumerProfile) return [];
    return detectAllergenConflicts(
      consumerProfile.allergies,
      chef.allergensCantAccommodate,
    );
  }, [consumerProfile]);

  const activeFilterCount = countActiveFilters(filters);
  const isEmpty = !isLoading && chefs.length === 0;

  return (
    <DiscoveryContext.Provider
      value={{
        chefs,
        consumerProfile,
        isLoading,
        error,
        filters,
        setFilters,
        resetFilters,
        activeFilterCount,
        handleSwipe,
        loadMore,
        refreshFeed,
        getConflicts,
        hasMore,
        isLoadingMore,
        isEmpty,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery(): DiscoveryContextValue {
  const context = useContext(DiscoveryContext);
  if (context === undefined) {
    throw new Error('useDiscovery must be used within a DiscoveryProvider');
  }
  return context;
}

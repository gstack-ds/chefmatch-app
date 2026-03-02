import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { ChefProfile, MenuItem, ChefAvailability } from '../models/types';
import { useAuth } from './use-auth';
import { getChefProfile, updateChefProfile, setChefLive } from '../services/chef-profile-service';
import { getMenuItems } from '../services/menu-service';
import { getAvailability } from '../services/availability-service';

interface StepCompletion {
  profile: boolean;
  photos: boolean;
  menu: boolean;
  availability: boolean;
}

interface ChefOnboardingContextValue {
  chefProfile: ChefProfile | null;
  menuItems: MenuItem[];
  availability: ChefAvailability[];
  isLoading: boolean;
  error: string | null;
  stepCompletion: StepCompletion;
  canGoLive: boolean;
  refreshProfile: () => Promise<void>;
  refreshMenu: () => Promise<void>;
  refreshAvailability: () => Promise<void>;
  goLive: () => Promise<void>;
}

const ChefOnboardingContext = createContext<ChefOnboardingContextValue | undefined>(undefined);

function computeStepCompletion(
  profile: ChefProfile | null,
  menuItems: MenuItem[],
  availability: ChefAvailability[],
): StepCompletion {
  const profileComplete = profile !== null
    && profile.bio.trim().length > 0
    && profile.cuisineSpecialties.length > 0
    && profile.serviceModels.length > 0
    && profile.priceRangeMin > 0
    && profile.priceRangeMax >= profile.priceRangeMin;

  return {
    profile: profileComplete,
    photos: profile !== null && profile.photos.length > 0,
    menu: menuItems.length > 0,
    availability: availability.length > 0,
  };
}

export function ChefOnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [chefProfile, setChefProfile] = useState<ChefProfile | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [availability, setAvailability] = useState<ChefAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const profile = await getChefProfile(user.id);
      setChefProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    }
  }, [user]);

  const refreshMenu = useCallback(async () => {
    if (!chefProfile) return;
    try {
      const items = await getMenuItems(chefProfile.id);
      setMenuItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu');
    }
  }, [chefProfile]);

  const refreshAvailability = useCallback(async () => {
    if (!chefProfile) return;
    try {
      const slots = await getAvailability(chefProfile.id);
      setAvailability(slots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load availability');
    }
  }, [chefProfile]);

  // Initial load: fetch profile, then menu + availability
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadAll() {
      setIsLoading(true);
      setError(null);
      try {
        const profile = await getChefProfile(user!.id);
        if (cancelled) return;
        setChefProfile(profile);

        const [items, slots] = await Promise.all([
          getMenuItems(profile.id),
          getAvailability(profile.id),
        ]);
        if (cancelled) return;
        setMenuItems(items);
        setAvailability(slots);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load onboarding data');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const stepCompletion = useMemo(
    () => computeStepCompletion(chefProfile, menuItems, availability),
    [chefProfile, menuItems, availability],
  );

  const canGoLive = stepCompletion.profile
    && stepCompletion.photos
    && stepCompletion.menu
    && stepCompletion.availability;

  const goLive = useCallback(async () => {
    if (!chefProfile || !canGoLive) return;
    try {
      await setChefLive(chefProfile.id);
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to go live');
      throw err;
    }
  }, [chefProfile, canGoLive, refreshProfile]);

  return (
    <ChefOnboardingContext.Provider
      value={{
        chefProfile,
        menuItems,
        availability,
        isLoading,
        error,
        stepCompletion,
        canGoLive,
        refreshProfile,
        refreshMenu,
        refreshAvailability,
        goLive,
      }}
    >
      {children}
    </ChefOnboardingContext.Provider>
  );
}

export function useChefOnboarding(): ChefOnboardingContextValue {
  const context = useContext(ChefOnboardingContext);
  if (context === undefined) {
    throw new Error('useChefOnboarding must be used within a ChefOnboardingProvider');
  }
  return context;
}

import { supabase } from '../config/supabase';
import { Database } from '../models/database';
import { DiscoverableChef, DiscoveryFilters } from '../models/types';
import { mapChefProfileRow } from '../utils/mappers';

type ChefProfileRow = Database['public']['Tables']['chef_profiles']['Row'];

const PAGE_SIZE = 20;

type ChefProfileRowWithUser = ChefProfileRow & {
  users: { display_name: string; avatar_url: string | null };
};

function mapDiscoverableChefRow(row: ChefProfileRowWithUser): DiscoverableChef {
  const base = mapChefProfileRow(row);
  return {
    ...base,
    displayName: row.users.display_name,
    avatarUrl: row.users.avatar_url,
  };
}

export async function fetchDiscoverableChefs(
  excludeChefIds: string[],
  filters: DiscoveryFilters,
  offset: number = 0,
): Promise<DiscoverableChef[]> {
  let query = supabase
    .from('chef_profiles')
    .select('*, users!chef_profiles_user_id_fkey(display_name, avatar_url)')
    .eq('is_live', true);

  if (excludeChefIds.length > 0) {
    query = query.not('user_id', 'in', `(${excludeChefIds.join(',')})`);
  }

  if (filters.cuisines.length > 0) {
    query = query.overlaps('cuisine_specialties', filters.cuisines);
  }

  if (filters.budgetMax !== null) {
    query = query.lte('price_range_min', filters.budgetMax);
  }

  if (filters.budgetMin !== null) {
    query = query.gte('price_range_max', filters.budgetMin);
  }

  if (filters.tier !== null) {
    query = query.eq('tier', filters.tier);
  }

  const { data, error } = await query.range(offset, offset + PAGE_SIZE - 1);

  if (error) throw new Error(error.message);

  return (data as unknown as ChefProfileRowWithUser[]).map(mapDiscoverableChefRow);
}

export function detectAllergenConflicts(
  consumerAllergies: string[],
  chefAllergensCantAccommodate: string[],
): string[] {
  return consumerAllergies.filter((allergy) =>
    chefAllergensCantAccommodate.includes(allergy),
  );
}

export function countActiveFilters(filters: DiscoveryFilters): number {
  let count = 0;
  if (filters.cuisines.length > 0) count++;
  if (filters.budgetMin !== null) count++;
  if (filters.budgetMax !== null) count++;
  if (filters.tier !== null) count++;
  if (filters.dietaryRestrictions.length > 0) count++;
  return count;
}

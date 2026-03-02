import { supabase } from '../config/supabase';
import { Database } from '../models/database';
import { ChefProfile } from '../models/types';
import { mapChefProfileRow } from '../utils/mappers';

type ChefProfileRow = Database['public']['Tables']['chef_profiles']['Row'];
type ChefProfileUpdate = Database['public']['Tables']['chef_profiles']['Update'];

export async function getChefProfile(userId: string): Promise<ChefProfile> {
  const { data, error } = await supabase
    .from('chef_profiles')
    .select('*')
    .eq('user_id', userId)
    .single<ChefProfileRow>();

  if (error || !data) {
    throw new Error(error?.message ?? 'Chef profile not found');
  }

  return mapChefProfileRow(data);
}

export async function updateChefProfile(
  id: string,
  updates: Partial<ChefProfileUpdate>,
): Promise<void> {
  const { error } = await supabase
    .from('chef_profiles')
    .update(updates)
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function setChefLive(id: string): Promise<void> {
  const { error } = await supabase
    .from('chef_profiles')
    .update({ is_live: true })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

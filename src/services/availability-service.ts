import { supabase } from '../config/supabase';
import { Database } from '../models/database';
import { ChefAvailability } from '../models/types';
import { mapChefAvailabilityRow } from '../utils/mappers';

type ChefAvailabilityRow = Database['public']['Tables']['chef_availability']['Row'];
type ChefAvailabilityInsert = Database['public']['Tables']['chef_availability']['Insert'];

export async function getAvailability(chefId: string): Promise<ChefAvailability[]> {
  const { data, error } = await supabase
    .from('chef_availability')
    .select('*')
    .eq('chef_id', chefId)
    .order('day_of_week', { ascending: true });

  if (error) throw new Error(error.message);

  return (data as ChefAvailabilityRow[]).map(mapChefAvailabilityRow);
}

export async function setAvailability(
  chefId: string,
  slots: Omit<ChefAvailabilityInsert, 'chef_id'>[],
): Promise<void> {
  // Bulk replace: delete all existing, then insert new
  const { error: deleteError } = await supabase
    .from('chef_availability')
    .delete()
    .eq('chef_id', chefId);

  if (deleteError) throw new Error(deleteError.message);

  if (slots.length === 0) return;

  const rows: ChefAvailabilityInsert[] = slots.map((slot) => ({
    ...slot,
    chef_id: chefId,
  }));

  const { error: insertError } = await supabase
    .from('chef_availability')
    .insert(rows);

  if (insertError) throw new Error(insertError.message);
}

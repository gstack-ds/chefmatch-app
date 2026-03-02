import { supabase } from '../config/supabase';
import { Database } from '../models/database';
import { ConsumerProfile } from '../models/types';
import { mapConsumerProfileRow } from '../utils/mappers';

type ConsumerProfileRow = Database['public']['Tables']['consumer_profiles']['Row'];

export async function getConsumerProfile(userId: string): Promise<ConsumerProfile> {
  const { data, error } = await supabase
    .from('consumer_profiles')
    .select('*')
    .eq('user_id', userId)
    .single<ConsumerProfileRow>();

  if (error || !data) {
    throw new Error(error?.message ?? 'Consumer profile not found');
  }

  return mapConsumerProfileRow(data);
}

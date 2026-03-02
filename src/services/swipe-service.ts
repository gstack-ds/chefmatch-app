import { supabase } from '../config/supabase';
import { Database } from '../models/database';
import { SwipeDirection } from '../config/constants';
import { Swipe, Conversation } from '../models/types';
import { mapSwipeRow, mapConversationRow } from '../utils/mappers';

type SwipeRow = Database['public']['Tables']['swipes']['Row'];
type ConversationRow = Database['public']['Tables']['conversations']['Row'];

export interface RecordSwipeResult {
  swipe: Swipe;
  conversation: Conversation | null;
}

export async function recordSwipe(
  consumerId: string,
  chefId: string,
  direction: SwipeDirection,
): Promise<RecordSwipeResult> {
  const { data: swipeData, error: swipeError } = await supabase
    .from('swipes')
    .insert({ consumer_id: consumerId, chef_id: chefId, direction })
    .select()
    .single<SwipeRow>();

  if (swipeError || !swipeData) {
    throw new Error(swipeError?.message ?? 'Failed to record swipe');
  }

  const swipe = mapSwipeRow(swipeData);

  if (direction !== SwipeDirection.LIKE) {
    return { swipe, conversation: null };
  }

  const { data: conversationData, error: conversationError } = await supabase
    .from('conversations')
    .insert({ consumer_id: consumerId, chef_id: chefId })
    .select()
    .single<ConversationRow>();

  if (conversationError || !conversationData) {
    throw new Error(conversationError?.message ?? 'Failed to create conversation');
  }

  return { swipe, conversation: mapConversationRow(conversationData) };
}

export async function getSwipedChefIds(consumerId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('swipes')
    .select('chef_id')
    .eq('consumer_id', consumerId);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: { chef_id: string }) => row.chef_id);
}

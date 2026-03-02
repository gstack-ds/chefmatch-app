import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { Database } from '../models/database';
import { Message } from '../models/types';
import { mapMessageRow } from '../utils/mappers';

type MessageRow = Database['public']['Tables']['messages']['Row'];

export interface ConversationWithDetails {
  id: string;
  consumerId: string;
  chefId: string;
  otherUserName: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
}

export async function getConversationsForUser(
  userId: string,
): Promise<ConversationWithDetails[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      consumer:consumer_id(display_name),
      chef:chef_id(display_name)
    `)
    .or(`consumer_id.eq.${userId},chef_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversations = (data as any[]).map((row) => {
    const isConsumer = row.consumer_id === userId;
    const otherUserName = isConsumer
      ? row.chef?.display_name ?? 'Unknown'
      : row.consumer?.display_name ?? 'Unknown';

    return {
      id: row.id,
      consumerId: row.consumer_id,
      chefId: row.chef_id,
      otherUserName,
      lastMessage: null as string | null,
      lastMessageAt: null as string | null,
      createdAt: row.created_at,
    };
  });

  // Fetch last message per conversation
  for (const convo of conversations) {
    const { data: msgs } = await supabase
      .from('messages')
      .select('content, created_at')
      .eq('conversation_id', convo.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (msgs && msgs.length > 0) {
      convo.lastMessage = msgs[0].content;
      convo.lastMessageAt = msgs[0].created_at;
    }
  }

  return conversations;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (data as MessageRow[] ?? []).map(mapMessageRow);
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    })
    .select()
    .single<MessageRow>();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to send message');
  }

  return mapMessageRow(data);
}

export async function markAsRead(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('id', messageId)
    .is('read_at', null);

  if (error) throw new Error(error.message);
}

export function subscribeToMessages(
  conversationId: string,
  onNewMessage: (message: Message) => void,
): RealtimeChannel {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onNewMessage(mapMessageRow(payload.new as MessageRow));
      },
    )
    .subscribe();
}

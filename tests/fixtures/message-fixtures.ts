import { Database } from '../../src/models/database';

type MessageRow = Database['public']['Tables']['messages']['Row'];
type ConversationRow = Database['public']['Tables']['conversations']['Row'];

export const mockMessageRow: MessageRow = {
  id: 'message-1',
  conversation_id: 'conversation-1',
  sender_id: 'user-123',
  content: 'Hello, Chef Marco!',
  read_at: null,
  created_at: '2026-03-02T10:00:00.000Z',
};

export const mockMessageRow2: MessageRow = {
  id: 'message-2',
  conversation_id: 'conversation-1',
  sender_id: 'chef-456',
  content: 'Hi! Looking forward to cooking for you.',
  read_at: '2026-03-02T10:05:00.000Z',
  created_at: '2026-03-02T10:02:00.000Z',
};

export const mockConversationRowWithJoin = {
  id: 'conversation-1',
  consumer_id: 'user-123',
  chef_id: 'chef-456',
  created_at: '2026-03-01T00:00:00.000Z',
  consumer: { display_name: 'Test User' },
  chef: { display_name: 'Chef Marco' },
};

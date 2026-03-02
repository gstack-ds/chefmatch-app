import { Session } from '@supabase/supabase-js';
import { Database } from '../../src/models/database';

type UserRow = Database['public']['Tables']['users']['Row'];

export const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: {
    id: 'user-123',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    app_metadata: {},
    user_metadata: {},
    created_at: '2026-01-01T00:00:00.000Z',
    identities: [],
  },
};

export const mockUserRow: UserRow = {
  id: 'user-123',
  email: 'test@example.com',
  display_name: 'Test User',
  role: 'consumer',
  avatar_url: null,
  phone: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

export const mockChefUserRow: UserRow = {
  id: 'chef-456',
  email: 'chef@example.com',
  display_name: 'Test Chef',
  role: 'chef',
  avatar_url: 'https://example.com/avatar.jpg',
  phone: '+1234567890',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

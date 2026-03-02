import { Database } from '../../src/models/database';

type ConsumerProfileRow = Database['public']['Tables']['consumer_profiles']['Row'];
type SwipeRow = Database['public']['Tables']['swipes']['Row'];
type ConversationRow = Database['public']['Tables']['conversations']['Row'];
type ChefProfileRow = Database['public']['Tables']['chef_profiles']['Row'];
type UserRow = Database['public']['Tables']['users']['Row'];

export const mockConsumerProfileRow: ConsumerProfileRow = {
  id: 'consumer-profile-1',
  user_id: 'user-123',
  allergies: ['Peanuts', 'Tree Nuts'],
  dietary_restrictions: ['vegetarian'],
  preferred_cuisines: ['Italian', 'Japanese'],
  max_budget: 100,
  latitude: 34.0522,
  longitude: -118.2437,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

export const mockSwipeRowLike: SwipeRow = {
  id: 'swipe-1',
  consumer_id: 'consumer-profile-1',
  chef_id: 'chef-profile-1',
  direction: 'like',
  created_at: '2026-01-02T00:00:00.000Z',
};

export const mockSwipeRowPass: SwipeRow = {
  id: 'swipe-2',
  consumer_id: 'consumer-profile-1',
  chef_id: 'chef-profile-2',
  direction: 'pass',
  created_at: '2026-01-02T01:00:00.000Z',
};

export const mockConversationRow: ConversationRow = {
  id: 'conversation-1',
  consumer_id: 'consumer-profile-1',
  chef_id: 'chef-profile-1',
  created_at: '2026-01-02T00:00:00.000Z',
};

export const mockLiveChefRow1: ChefProfileRow = {
  id: 'chef-profile-10',
  user_id: 'chef-user-10',
  tier: 'classically_trained',
  bio: 'Award-winning Italian chef specializing in handmade pasta.',
  cuisine_specialties: ['Italian', 'French'],
  photos: ['https://example.com/chef10-photo1.jpg', 'https://example.com/chef10-photo2.jpg'],
  service_models: ['full_service'],
  price_range_min: 60,
  price_range_max: 180,
  service_radius: 30,
  latitude: 34.0522,
  longitude: -118.2437,
  allergens_cant_accommodate: ['Peanuts'],
  background_check_status: 'passed',
  training_completed: true,
  is_live: true,
  average_rating: 4.8,
  total_reviews: 25,
  completed_events: 30,
  home_chef_level: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-15T00:00:00.000Z',
};

export const mockLiveChefRow2: ChefProfileRow = {
  id: 'chef-profile-11',
  user_id: 'chef-user-11',
  tier: 'home_chef',
  bio: 'Home cook who loves Southern comfort food.',
  cuisine_specialties: ['Southern / Soul Food', 'BBQ / Grilling'],
  photos: ['https://example.com/chef11-photo1.jpg'],
  service_models: ['full_service', 'collaborative'],
  price_range_min: 30,
  price_range_max: 80,
  service_radius: 15,
  latitude: 34.06,
  longitude: -118.25,
  allergens_cant_accommodate: [],
  background_check_status: 'passed',
  training_completed: true,
  is_live: true,
  average_rating: 4.5,
  total_reviews: 10,
  completed_events: 12,
  home_chef_level: 2,
  created_at: '2026-01-05T00:00:00.000Z',
  updated_at: '2026-01-20T00:00:00.000Z',
};

export const mockLiveChefUserRow1: UserRow = {
  id: 'chef-user-10',
  email: 'chef10@example.com',
  display_name: 'Marco Rossi',
  role: 'chef',
  avatar_url: 'https://example.com/chef10-avatar.jpg',
  phone: '+1111111111',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

export const mockLiveChefUserRow2: UserRow = {
  id: 'chef-user-11',
  email: 'chef11@example.com',
  display_name: 'Sarah Mae',
  role: 'chef',
  avatar_url: null,
  phone: '+2222222222',
  created_at: '2026-01-05T00:00:00.000Z',
  updated_at: '2026-01-05T00:00:00.000Z',
};

// Combined row shape returned by Supabase join query
export type ChefProfileRowWithUser = ChefProfileRow & {
  users: { display_name: string; avatar_url: string | null };
};

export const mockDiscoverableChefRow1: ChefProfileRowWithUser = {
  ...mockLiveChefRow1,
  users: {
    display_name: mockLiveChefUserRow1.display_name,
    avatar_url: mockLiveChefUserRow1.avatar_url,
  },
};

export const mockDiscoverableChefRow2: ChefProfileRowWithUser = {
  ...mockLiveChefRow2,
  users: {
    display_name: mockLiveChefUserRow2.display_name,
    avatar_url: mockLiveChefUserRow2.avatar_url,
  },
};

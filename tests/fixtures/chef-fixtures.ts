import { Database } from '../../src/models/database';

type ChefProfileRow = Database['public']['Tables']['chef_profiles']['Row'];
type MenuItemRow = Database['public']['Tables']['menu_items']['Row'];
type ChefAvailabilityRow = Database['public']['Tables']['chef_availability']['Row'];

export const mockChefProfileRow: ChefProfileRow = {
  id: 'chef-profile-1',
  user_id: 'chef-456',
  tier: 'classically_trained',
  bio: 'Classically trained chef with 10 years of experience.',
  cuisine_specialties: ['Italian', 'French'],
  photos: ['https://example.com/photo1.jpg'],
  service_models: ['full_service'],
  price_range_min: 50,
  price_range_max: 150,
  service_radius: 25,
  latitude: 34.0522,
  longitude: -118.2437,
  allergens_cant_accommodate: ['Tree Nuts'],
  background_check_status: 'not_started',
  training_completed: false,
  is_live: false,
  average_rating: null,
  total_reviews: 0,
  completed_events: 0,
  home_chef_level: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

export const mockEmptyChefProfileRow: ChefProfileRow = {
  id: 'chef-profile-2',
  user_id: 'chef-789',
  tier: 'home_chef',
  bio: '',
  cuisine_specialties: [],
  photos: [],
  service_models: [],
  price_range_min: 0,
  price_range_max: 0,
  service_radius: 0,
  latitude: null,
  longitude: null,
  allergens_cant_accommodate: [],
  background_check_status: 'not_started',
  training_completed: false,
  is_live: false,
  average_rating: null,
  total_reviews: 0,
  completed_events: 0,
  home_chef_level: 1,
  created_at: '2026-01-15T00:00:00.000Z',
  updated_at: '2026-01-15T00:00:00.000Z',
};

export const mockMenuItemRow: MenuItemRow = {
  id: 'menu-item-1',
  chef_id: 'chef-profile-1',
  name: 'Truffle Risotto',
  description: 'Creamy arborio rice with black truffle and parmesan.',
  price: 45,
  allergens: ['Milk', 'Wheat'],
  is_available: true,
  sort_order: 0,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

export const mockMenuItemRow2: MenuItemRow = {
  id: 'menu-item-2',
  chef_id: 'chef-profile-1',
  name: 'Pan-Seared Salmon',
  description: 'Wild-caught salmon with lemon butter sauce.',
  price: 55,
  allergens: ['Fish', 'Milk'],
  is_available: true,
  sort_order: 1,
  created_at: '2026-01-02T00:00:00.000Z',
  updated_at: '2026-01-02T00:00:00.000Z',
};

export const mockAvailabilityRow: ChefAvailabilityRow = {
  id: 'avail-1',
  chef_id: 'chef-profile-1',
  day_of_week: 6,
  start_time: '10:00',
  end_time: '20:00',
};

export const mockAvailabilityRow2: ChefAvailabilityRow = {
  id: 'avail-2',
  chef_id: 'chef-profile-1',
  day_of_week: 0,
  start_time: '12:00',
  end_time: '18:00',
};

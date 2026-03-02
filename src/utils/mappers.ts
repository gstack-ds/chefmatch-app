import { Database } from '../models/database';
import { ChefTier, ServiceModel, BackgroundCheckStatus } from '../config/constants';
import { UserProfile, ChefProfile, MenuItem, ChefAvailability } from '../models/types';

type UserRow = Database['public']['Tables']['users']['Row'];
type ChefProfileRow = Database['public']['Tables']['chef_profiles']['Row'];
type MenuItemRow = Database['public']['Tables']['menu_items']['Row'];
type ChefAvailabilityRow = Database['public']['Tables']['chef_availability']['Row'];

export function mapUserRow(row: UserRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    avatarUrl: row.avatar_url,
    phone: row.phone,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapChefProfileRow(row: ChefProfileRow): ChefProfile {
  return {
    id: row.id,
    userId: row.user_id,
    tier: row.tier as ChefTier,
    bio: row.bio,
    cuisineSpecialties: row.cuisine_specialties,
    photos: row.photos,
    serviceModels: row.service_models as ServiceModel[],
    priceRangeMin: row.price_range_min,
    priceRangeMax: row.price_range_max,
    serviceRadius: row.service_radius,
    latitude: row.latitude,
    longitude: row.longitude,
    allergensCantAccommodate: row.allergens_cant_accommodate,
    backgroundCheckStatus: row.background_check_status as BackgroundCheckStatus,
    trainingCompleted: row.training_completed,
    isLive: row.is_live,
    averageRating: row.average_rating,
    totalReviews: row.total_reviews,
    completedEvents: row.completed_events,
    homeChefLevel: row.home_chef_level,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMenuItemRow(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    chefId: row.chef_id,
    name: row.name,
    description: row.description,
    price: row.price,
    allergens: row.allergens,
    isAvailable: row.is_available,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapChefAvailabilityRow(row: ChefAvailabilityRow): ChefAvailability {
  return {
    id: row.id,
    chefId: row.chef_id,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
  };
}

import { Database } from '../models/database';
import { ChefTier, ServiceModel, BackgroundCheckStatus, SwipeDirection, BookingStatus, GroceryArrangement } from '../config/constants';
import { UserProfile, ChefProfile, MenuItem, ChefAvailability, ConsumerProfile, Swipe, Conversation, Booking, Message, Review } from '../models/types';

type UserRow = Database['public']['Tables']['users']['Row'];
type ChefProfileRow = Database['public']['Tables']['chef_profiles']['Row'];
type MenuItemRow = Database['public']['Tables']['menu_items']['Row'];
type ChefAvailabilityRow = Database['public']['Tables']['chef_availability']['Row'];
type ConsumerProfileRow = Database['public']['Tables']['consumer_profiles']['Row'];
type SwipeRow = Database['public']['Tables']['swipes']['Row'];
type ConversationRow = Database['public']['Tables']['conversations']['Row'];
type BookingRow = Database['public']['Tables']['bookings']['Row'];
type MessageRow = Database['public']['Tables']['messages']['Row'];
type ReviewRow = Database['public']['Tables']['reviews']['Row'];

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

export function mapConsumerProfileRow(row: ConsumerProfileRow): ConsumerProfile {
  return {
    id: row.id,
    userId: row.user_id,
    allergies: row.allergies,
    dietaryRestrictions: row.dietary_restrictions,
    preferredCuisines: row.preferred_cuisines,
    maxBudget: row.max_budget,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapSwipeRow(row: SwipeRow): Swipe {
  return {
    id: row.id,
    consumerId: row.consumer_id,
    chefId: row.chef_id,
    direction: row.direction as SwipeDirection,
    createdAt: row.created_at,
  };
}

export function mapConversationRow(row: ConversationRow): Conversation {
  return {
    id: row.id,
    consumerId: row.consumer_id,
    chefId: row.chef_id,
    createdAt: row.created_at,
  };
}

export function mapBookingRow(row: BookingRow): Booking {
  return {
    id: row.id,
    consumerId: row.consumer_id,
    chefId: row.chef_id,
    conversationId: row.conversation_id,
    status: row.status as BookingStatus,
    serviceModel: row.service_model as ServiceModel,
    eventDate: row.event_date,
    partySize: row.party_size,
    occasion: row.occasion,
    specialRequests: row.special_requests,
    groceryArrangement: row.grocery_arrangement as GroceryArrangement,
    totalPrice: row.total_price,
    locationAddress: row.location_address,
    locationLatitude: row.location_latitude,
    locationLongitude: row.location_longitude,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMessageRow(row: MessageRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    content: row.content,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export function mapReviewRow(row: ReviewRow): Review {
  return {
    id: row.id,
    bookingId: row.booking_id,
    reviewerId: row.reviewer_id,
    revieweeId: row.reviewee_id,
    rating: row.rating,
    text: row.text,
    createdAt: row.created_at,
  };
}

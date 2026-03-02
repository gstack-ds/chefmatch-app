import {
  ChefTier,
  BookingStatus,
  ServiceModel,
  BackgroundCheckStatus,
  GroceryArrangement,
  SwipeDirection,
} from '../config/constants';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'chef' | 'consumer';
  avatarUrl: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChefProfile {
  id: string;
  userId: string;
  tier: ChefTier;
  bio: string;
  cuisineSpecialties: string[];
  photos: string[];
  serviceModels: ServiceModel[];
  priceRangeMin: number;
  priceRangeMax: number;
  serviceRadius: number;
  latitude: number | null;
  longitude: number | null;
  allergensCantAccommodate: string[];
  backgroundCheckStatus: BackgroundCheckStatus;
  trainingCompleted: boolean;
  isLive: boolean;
  averageRating: number | null;
  totalReviews: number;
  completedEvents: number;
  homeChefLevel: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChefAvailability {
  id: string;
  chefId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface MenuItem {
  id: string;
  chefId: string;
  name: string;
  description: string;
  price: number;
  allergens: string[];
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConsumerProfile {
  id: string;
  userId: string;
  allergies: string[];
  dietaryRestrictions: string[];
  preferredCuisines: string[];
  maxBudget: number | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Swipe {
  id: string;
  consumerId: string;
  chefId: string;
  direction: SwipeDirection;
  createdAt: string;
}

export interface Conversation {
  id: string;
  consumerId: string;
  chefId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

export interface Booking {
  id: string;
  consumerId: string;
  chefId: string;
  conversationId: string | null;
  status: BookingStatus;
  serviceModel: ServiceModel;
  eventDate: string;
  partySize: number;
  occasion: string;
  specialRequests: string;
  groceryArrangement: GroceryArrangement;
  totalPrice: number | null;
  locationAddress: string | null;
  locationLatitude: number | null;
  locationLongitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  text: string;
  createdAt: string;
}

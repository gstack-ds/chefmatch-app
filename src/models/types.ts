import { ChefTier, BookingStatus, ServiceModel } from '../config/constants';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'chef' | 'consumer';
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
  latitude: number;
  longitude: number;
  allergensCantAccommodate: string[];
  backgroundCheckStatus: 'pending' | 'passed' | 'failed';
  trainingCompleted: boolean;
  isLive: boolean;
  averageRating: number | null;
  totalReviews: number;
  completedEvents: number;
  homeChefLevel: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConsumerProfile {
  id: string;
  userId: string;
  allergies: string[];
  dietaryRestrictions: string[];
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  consumerId: string;
  chefId: string;
  status: BookingStatus;
  serviceModel: ServiceModel;
  eventDate: string;
  partySize: number;
  occasion: string;
  specialRequests: string;
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

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

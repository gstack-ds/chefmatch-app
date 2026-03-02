export const APP_NAME = 'ChefMatch';

export enum ChefTier {
  CLASSICALLY_TRAINED = 'classically_trained',
  HOME_CHEF = 'home_chef',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ServiceModel {
  FULL_SERVICE = 'full_service',
  COLLABORATIVE = 'collaborative',
}

export const FDA_TOP_9_ALLERGENS = [
  'Milk',
  'Eggs',
  'Fish',
  'Shellfish',
  'Tree Nuts',
  'Peanuts',
  'Wheat',
  'Soybeans',
  'Sesame',
] as const;

export enum GroceryArrangement {
  CHEF_PROVIDES = 'chef_provides',
  CONSUMER_PROVIDES = 'consumer_provides',
  SPLIT = 'split',
}

export enum BackgroundCheckStatus {
  NOT_STARTED = 'not_started',
  PENDING = 'pending',
  PASSED = 'passed',
  FAILED = 'failed',
}

export enum SwipeDirection {
  LIKE = 'like',
  PASS = 'pass',
}

export const HOME_CHEF_PROGRESSION = {
  LEVEL_1: { maxGuests: 4, requiredEvents: 0, minRating: 0 },
  LEVEL_2: { maxGuests: 8, requiredEvents: 3, minRating: 4.0 },
  LEVEL_3: { maxGuests: 12, requiredEvents: 8, minRating: 4.0 },
} as const;

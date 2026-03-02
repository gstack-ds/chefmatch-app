import {
  mapUserRow,
  mapChefProfileRow,
  mapMenuItemRow,
  mapChefAvailabilityRow,
  mapConsumerProfileRow,
  mapSwipeRow,
  mapConversationRow,
} from '../../../src/utils/mappers';
import { mockUserRow, mockChefUserRow } from '../../fixtures/auth-fixtures';
import {
  mockChefProfileRow,
  mockMenuItemRow,
  mockAvailabilityRow,
} from '../../fixtures/chef-fixtures';
import {
  mockConsumerProfileRow,
  mockSwipeRowLike,
  mockConversationRow,
} from '../../fixtures/consumer-fixtures';

describe('mapUserRow', () => {
  it('maps a consumer user row to UserProfile', () => {
    const result = mapUserRow(mockUserRow);

    expect(result).toEqual({
      id: 'user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'consumer',
      avatarUrl: null,
      phone: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('maps a chef user row to UserProfile', () => {
    const result = mapUserRow(mockChefUserRow);

    expect(result).toEqual({
      id: 'chef-456',
      email: 'chef@example.com',
      displayName: 'Test Chef',
      role: 'chef',
      avatarUrl: 'https://example.com/avatar.jpg',
      phone: '+1234567890',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('converts snake_case keys to camelCase', () => {
    const result = mapUserRow(mockUserRow);

    expect(result).toHaveProperty('displayName');
    expect(result).toHaveProperty('avatarUrl');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
    expect(result).not.toHaveProperty('display_name');
    expect(result).not.toHaveProperty('avatar_url');
    expect(result).not.toHaveProperty('created_at');
    expect(result).not.toHaveProperty('updated_at');
  });
});

describe('mapChefProfileRow', () => {
  it('maps a chef profile row to ChefProfile', () => {
    const result = mapChefProfileRow(mockChefProfileRow);

    expect(result).toEqual({
      id: 'chef-profile-1',
      userId: 'chef-456',
      tier: 'classically_trained',
      bio: 'Classically trained chef with 10 years of experience.',
      cuisineSpecialties: ['Italian', 'French'],
      photos: ['https://example.com/photo1.jpg'],
      serviceModels: ['full_service'],
      priceRangeMin: 50,
      priceRangeMax: 150,
      serviceRadius: 25,
      latitude: 34.0522,
      longitude: -118.2437,
      allergensCantAccommodate: ['Tree Nuts'],
      backgroundCheckStatus: 'not_started',
      trainingCompleted: false,
      isLive: false,
      averageRating: null,
      totalReviews: 0,
      completedEvents: 0,
      homeChefLevel: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('converts snake_case keys to camelCase', () => {
    const result = mapChefProfileRow(mockChefProfileRow);

    expect(result).toHaveProperty('userId');
    expect(result).toHaveProperty('cuisineSpecialties');
    expect(result).toHaveProperty('serviceModels');
    expect(result).toHaveProperty('priceRangeMin');
    expect(result).toHaveProperty('priceRangeMax');
    expect(result).toHaveProperty('serviceRadius');
    expect(result).toHaveProperty('backgroundCheckStatus');
    expect(result).toHaveProperty('isLive');
    expect(result).not.toHaveProperty('user_id');
    expect(result).not.toHaveProperty('cuisine_specialties');
    expect(result).not.toHaveProperty('service_models');
    expect(result).not.toHaveProperty('price_range_min');
    expect(result).not.toHaveProperty('is_live');
  });
});

describe('mapMenuItemRow', () => {
  it('maps a menu item row to MenuItem', () => {
    const result = mapMenuItemRow(mockMenuItemRow);

    expect(result).toEqual({
      id: 'menu-item-1',
      chefId: 'chef-profile-1',
      name: 'Truffle Risotto',
      description: 'Creamy arborio rice with black truffle and parmesan.',
      price: 45,
      allergens: ['Milk', 'Wheat'],
      isAvailable: true,
      sortOrder: 0,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('converts snake_case keys to camelCase', () => {
    const result = mapMenuItemRow(mockMenuItemRow);

    expect(result).toHaveProperty('chefId');
    expect(result).toHaveProperty('isAvailable');
    expect(result).toHaveProperty('sortOrder');
    expect(result).not.toHaveProperty('chef_id');
    expect(result).not.toHaveProperty('is_available');
    expect(result).not.toHaveProperty('sort_order');
  });
});

describe('mapChefAvailabilityRow', () => {
  it('maps an availability row to ChefAvailability', () => {
    const result = mapChefAvailabilityRow(mockAvailabilityRow);

    expect(result).toEqual({
      id: 'avail-1',
      chefId: 'chef-profile-1',
      dayOfWeek: 6,
      startTime: '10:00',
      endTime: '20:00',
    });
  });

  it('converts snake_case keys to camelCase', () => {
    const result = mapChefAvailabilityRow(mockAvailabilityRow);

    expect(result).toHaveProperty('chefId');
    expect(result).toHaveProperty('dayOfWeek');
    expect(result).toHaveProperty('startTime');
    expect(result).toHaveProperty('endTime');
    expect(result).not.toHaveProperty('chef_id');
    expect(result).not.toHaveProperty('day_of_week');
    expect(result).not.toHaveProperty('start_time');
    expect(result).not.toHaveProperty('end_time');
  });
});

describe('mapConsumerProfileRow', () => {
  it('maps a consumer profile row to ConsumerProfile', () => {
    const result = mapConsumerProfileRow(mockConsumerProfileRow);

    expect(result).toEqual({
      id: 'consumer-profile-1',
      userId: 'user-123',
      allergies: ['Peanuts', 'Tree Nuts'],
      dietaryRestrictions: ['vegetarian'],
      preferredCuisines: ['Italian', 'Japanese'],
      maxBudget: 100,
      latitude: 34.0522,
      longitude: -118.2437,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('converts snake_case keys to camelCase', () => {
    const result = mapConsumerProfileRow(mockConsumerProfileRow);

    expect(result).toHaveProperty('userId');
    expect(result).toHaveProperty('dietaryRestrictions');
    expect(result).toHaveProperty('preferredCuisines');
    expect(result).toHaveProperty('maxBudget');
    expect(result).not.toHaveProperty('user_id');
    expect(result).not.toHaveProperty('dietary_restrictions');
    expect(result).not.toHaveProperty('preferred_cuisines');
    expect(result).not.toHaveProperty('max_budget');
  });
});

describe('mapSwipeRow', () => {
  it('maps a swipe row to Swipe', () => {
    const result = mapSwipeRow(mockSwipeRowLike);

    expect(result).toEqual({
      id: 'swipe-1',
      consumerId: 'consumer-profile-1',
      chefId: 'chef-profile-1',
      direction: 'like',
      createdAt: '2026-01-02T00:00:00.000Z',
    });
  });

  it('converts snake_case keys to camelCase', () => {
    const result = mapSwipeRow(mockSwipeRowLike);

    expect(result).toHaveProperty('consumerId');
    expect(result).toHaveProperty('chefId');
    expect(result).toHaveProperty('createdAt');
    expect(result).not.toHaveProperty('consumer_id');
    expect(result).not.toHaveProperty('chef_id');
    expect(result).not.toHaveProperty('created_at');
  });
});

describe('mapConversationRow', () => {
  it('maps a conversation row to Conversation', () => {
    const result = mapConversationRow(mockConversationRow);

    expect(result).toEqual({
      id: 'conversation-1',
      consumerId: 'consumer-profile-1',
      chefId: 'chef-profile-1',
      createdAt: '2026-01-02T00:00:00.000Z',
    });
  });

  it('converts snake_case keys to camelCase', () => {
    const result = mapConversationRow(mockConversationRow);

    expect(result).toHaveProperty('consumerId');
    expect(result).toHaveProperty('chefId');
    expect(result).toHaveProperty('createdAt');
    expect(result).not.toHaveProperty('consumer_id');
    expect(result).not.toHaveProperty('chef_id');
    expect(result).not.toHaveProperty('created_at');
  });
});

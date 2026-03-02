import {
  APP_NAME,
  ChefTier,
  BookingStatus,
  ServiceModel,
  GroceryArrangement,
  BackgroundCheckStatus,
  SwipeDirection,
  FDA_TOP_9_ALLERGENS,
  HOME_CHEF_PROGRESSION,
} from '../../../src/config/constants';

describe('App Constants', () => {
  it('should have the correct app name', () => {
    expect(APP_NAME).toBe('ChefMatch');
  });

  it('should define two chef tiers', () => {
    expect(ChefTier.CLASSICALLY_TRAINED).toBe('classically_trained');
    expect(ChefTier.HOME_CHEF).toBe('home_chef');
  });

  it('should define four booking statuses', () => {
    expect(Object.values(BookingStatus)).toHaveLength(4);
    expect(BookingStatus.PENDING).toBe('pending');
    expect(BookingStatus.CONFIRMED).toBe('confirmed');
    expect(BookingStatus.COMPLETED).toBe('completed');
    expect(BookingStatus.CANCELLED).toBe('cancelled');
  });

  it('should define two service models', () => {
    expect(ServiceModel.FULL_SERVICE).toBe('full_service');
    expect(ServiceModel.COLLABORATIVE).toBe('collaborative');
  });

  it('should include all FDA top 9 allergens', () => {
    expect(FDA_TOP_9_ALLERGENS).toHaveLength(9);
    expect(FDA_TOP_9_ALLERGENS).toContain('Milk');
    expect(FDA_TOP_9_ALLERGENS).toContain('Peanuts');
    expect(FDA_TOP_9_ALLERGENS).toContain('Sesame');
  });

  it('should define home chef progression levels with increasing guest limits', () => {
    expect(HOME_CHEF_PROGRESSION.LEVEL_1.maxGuests).toBe(4);
    expect(HOME_CHEF_PROGRESSION.LEVEL_2.maxGuests).toBe(8);
    expect(HOME_CHEF_PROGRESSION.LEVEL_3.maxGuests).toBe(12);
    expect(HOME_CHEF_PROGRESSION.LEVEL_2.requiredEvents).toBeGreaterThan(
      HOME_CHEF_PROGRESSION.LEVEL_1.requiredEvents
    );
    expect(HOME_CHEF_PROGRESSION.LEVEL_3.requiredEvents).toBeGreaterThan(
      HOME_CHEF_PROGRESSION.LEVEL_2.requiredEvents
    );
  });

  it('should define three grocery arrangements', () => {
    expect(Object.values(GroceryArrangement)).toHaveLength(3);
    expect(GroceryArrangement.CHEF_PROVIDES).toBe('chef_provides');
    expect(GroceryArrangement.CONSUMER_PROVIDES).toBe('consumer_provides');
    expect(GroceryArrangement.SPLIT).toBe('split');
  });

  it('should define four background check statuses', () => {
    expect(Object.values(BackgroundCheckStatus)).toHaveLength(4);
    expect(BackgroundCheckStatus.NOT_STARTED).toBe('not_started');
    expect(BackgroundCheckStatus.PENDING).toBe('pending');
    expect(BackgroundCheckStatus.PASSED).toBe('passed');
    expect(BackgroundCheckStatus.FAILED).toBe('failed');
  });

  it('should define two swipe directions', () => {
    expect(Object.values(SwipeDirection)).toHaveLength(2);
    expect(SwipeDirection.LIKE).toBe('like');
    expect(SwipeDirection.PASS).toBe('pass');
  });
});

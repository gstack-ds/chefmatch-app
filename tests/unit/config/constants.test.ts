import {
  APP_NAME,
  ChefTier,
  BookingStatus,
  ServiceModel,
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
});

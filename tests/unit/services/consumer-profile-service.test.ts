import { mockConsumerProfileRow } from '../../fixtures/consumer-fixtures';

const mockFrom = jest.fn();

jest.mock('../../../src/config/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import * as consumerProfileService from '../../../src/services/consumer-profile-service';

function mockChainedQuery(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.single = jest.fn().mockResolvedValue({ data, error });
  return chain;
}

function mockUpdateChain(error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.update = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockResolvedValue({ error });
  return chain;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getConsumerProfile', () => {
  it('fetches and maps consumer profile by user ID', async () => {
    mockFrom.mockImplementation(() => mockChainedQuery(mockConsumerProfileRow));

    const result = await consumerProfileService.getConsumerProfile('user-123');

    expect(mockFrom).toHaveBeenCalledWith('consumer_profiles');
    expect(result.id).toBe('consumer-profile-1');
    expect(result.userId).toBe('user-123');
    expect(result.allergies).toEqual(['Peanuts', 'Tree Nuts']);
    expect(result.dietaryRestrictions).toEqual(['vegetarian']);
    expect(result.preferredCuisines).toEqual(['Italian', 'Japanese']);
    expect(result.maxBudget).toBe(100);
  });

  it('throws when profile not found', async () => {
    mockFrom.mockImplementation(() =>
      mockChainedQuery(null, { message: 'Row not found' }),
    );

    await expect(
      consumerProfileService.getConsumerProfile('bad-id'),
    ).rejects.toThrow('Row not found');
  });

  it('throws with default message when no error details', async () => {
    mockFrom.mockImplementation(() =>
      mockChainedQuery(null, null),
    );

    await expect(
      consumerProfileService.getConsumerProfile('bad-id'),
    ).rejects.toThrow('Consumer profile not found');
  });
});

describe('updateConsumerProfile', () => {
  it('updates consumer profile fields', async () => {
    mockFrom.mockImplementation(() => mockUpdateChain());

    await consumerProfileService.updateConsumerProfile('user-123', {
      allergies: ['Milk', 'Eggs'],
      dietary_restrictions: ['vegan'],
    });

    expect(mockFrom).toHaveBeenCalledWith('consumer_profiles');
  });

  it('throws on error', async () => {
    mockFrom.mockImplementation(() => mockUpdateChain({ message: 'Update failed' }));

    await expect(
      consumerProfileService.updateConsumerProfile('user-123', { allergies: [] }),
    ).rejects.toThrow('Update failed');
  });
});

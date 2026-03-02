import {
  mockDiscoverableChefRow1,
  mockDiscoverableChefRow2,
} from '../../fixtures/consumer-fixtures';
import { DiscoveryFilters } from '../../../src/models/types';
import { ChefTier } from '../../../src/config/constants';

const mockFrom = jest.fn();

jest.mock('../../../src/config/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import * as discoveryService from '../../../src/services/discovery-service';

const DEFAULT_FILTERS: DiscoveryFilters = {
  cuisines: [],
  budgetMin: null,
  budgetMax: null,
  tier: null,
  dietaryRestrictions: [],
};

function mockQueryChain(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.not = jest.fn().mockReturnValue(chain);
  chain.overlaps = jest.fn().mockReturnValue(chain);
  chain.lte = jest.fn().mockReturnValue(chain);
  chain.gte = jest.fn().mockReturnValue(chain);
  chain.range = jest.fn().mockResolvedValue({ data, error });
  return chain;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchDiscoverableChefs', () => {
  it('returns mapped discoverable chefs', async () => {
    const chain = mockQueryChain([mockDiscoverableChefRow1, mockDiscoverableChefRow2]);
    mockFrom.mockImplementation(() => chain);

    const result = await discoveryService.fetchDiscoverableChefs([], DEFAULT_FILTERS);

    expect(mockFrom).toHaveBeenCalledWith('chef_profiles');
    expect(result).toHaveLength(2);
    expect(result[0].displayName).toBe('Marco Rossi');
    expect(result[0].avatarUrl).toBe('https://example.com/chef10-avatar.jpg');
    expect(result[0].isLive).toBe(true);
    expect(result[1].displayName).toBe('Sarah Mae');
    expect(result[1].avatarUrl).toBeNull();
  });

  it('filters by is_live', async () => {
    const chain = mockQueryChain([]);
    mockFrom.mockImplementation(() => chain);

    await discoveryService.fetchDiscoverableChefs([], DEFAULT_FILTERS);

    expect(chain.eq).toHaveBeenCalledWith('is_live', true);
  });

  it('excludes already-swiped chef IDs', async () => {
    const chain = mockQueryChain([]);
    mockFrom.mockImplementation(() => chain);

    await discoveryService.fetchDiscoverableChefs(['chef-1', 'chef-2'], DEFAULT_FILTERS);

    expect(chain.not).toHaveBeenCalledWith('id', 'in', '(chef-1,chef-2)');
  });

  it('does not call .not when exclude list is empty', async () => {
    const chain = mockQueryChain([]);
    mockFrom.mockImplementation(() => chain);

    await discoveryService.fetchDiscoverableChefs([], DEFAULT_FILTERS);

    expect(chain.not).not.toHaveBeenCalled();
  });

  it('applies cuisine filter', async () => {
    const chain = mockQueryChain([]);
    mockFrom.mockImplementation(() => chain);

    await discoveryService.fetchDiscoverableChefs([], {
      ...DEFAULT_FILTERS,
      cuisines: ['Italian', 'French'],
    });

    expect(chain.overlaps).toHaveBeenCalledWith('cuisine_specialties', ['Italian', 'French']);
  });

  it('applies budget max filter', async () => {
    const chain = mockQueryChain([]);
    mockFrom.mockImplementation(() => chain);

    await discoveryService.fetchDiscoverableChefs([], {
      ...DEFAULT_FILTERS,
      budgetMax: 100,
    });

    expect(chain.lte).toHaveBeenCalledWith('price_range_min', 100);
  });

  it('applies budget min filter', async () => {
    const chain = mockQueryChain([]);
    mockFrom.mockImplementation(() => chain);

    await discoveryService.fetchDiscoverableChefs([], {
      ...DEFAULT_FILTERS,
      budgetMin: 50,
    });

    expect(chain.gte).toHaveBeenCalledWith('price_range_max', 50);
  });

  it('applies tier filter', async () => {
    const chain = mockQueryChain([]);
    mockFrom.mockImplementation(() => chain);

    await discoveryService.fetchDiscoverableChefs([], {
      ...DEFAULT_FILTERS,
      tier: ChefTier.HOME_CHEF,
    });

    // eq is called for is_live AND tier
    expect(chain.eq).toHaveBeenCalledWith('tier', 'home_chef');
  });

  it('paginates with offset', async () => {
    const chain = mockQueryChain([]);
    mockFrom.mockImplementation(() => chain);

    await discoveryService.fetchDiscoverableChefs([], DEFAULT_FILTERS, 20);

    expect(chain.range).toHaveBeenCalledWith(20, 39);
  });

  it('throws on query error', async () => {
    const chain = mockQueryChain(null, { message: 'Query failed' });
    mockFrom.mockImplementation(() => chain);

    await expect(
      discoveryService.fetchDiscoverableChefs([], DEFAULT_FILTERS),
    ).rejects.toThrow('Query failed');
  });
});

describe('detectAllergenConflicts', () => {
  it('returns overlapping allergens', () => {
    const result = discoveryService.detectAllergenConflicts(
      ['Peanuts', 'Tree Nuts', 'Milk'],
      ['Peanuts', 'Shellfish'],
    );

    expect(result).toEqual(['Peanuts']);
  });

  it('returns empty array when no conflicts', () => {
    const result = discoveryService.detectAllergenConflicts(
      ['Milk', 'Eggs'],
      ['Peanuts', 'Shellfish'],
    );

    expect(result).toEqual([]);
  });

  it('returns empty array when consumer has no allergies', () => {
    const result = discoveryService.detectAllergenConflicts(
      [],
      ['Peanuts', 'Shellfish'],
    );

    expect(result).toEqual([]);
  });

  it('returns empty array when chef can accommodate everything', () => {
    const result = discoveryService.detectAllergenConflicts(
      ['Peanuts', 'Milk'],
      [],
    );

    expect(result).toEqual([]);
  });

  it('returns multiple conflicts', () => {
    const result = discoveryService.detectAllergenConflicts(
      ['Peanuts', 'Tree Nuts', 'Milk'],
      ['Peanuts', 'Tree Nuts'],
    );

    expect(result).toEqual(['Peanuts', 'Tree Nuts']);
  });
});

describe('countActiveFilters', () => {
  it('returns 0 for default filters', () => {
    expect(discoveryService.countActiveFilters(DEFAULT_FILTERS)).toBe(0);
  });

  it('counts cuisine filter', () => {
    expect(discoveryService.countActiveFilters({
      ...DEFAULT_FILTERS,
      cuisines: ['Italian'],
    })).toBe(1);
  });

  it('counts budget min filter', () => {
    expect(discoveryService.countActiveFilters({
      ...DEFAULT_FILTERS,
      budgetMin: 50,
    })).toBe(1);
  });

  it('counts budget max filter', () => {
    expect(discoveryService.countActiveFilters({
      ...DEFAULT_FILTERS,
      budgetMax: 200,
    })).toBe(1);
  });

  it('counts tier filter', () => {
    expect(discoveryService.countActiveFilters({
      ...DEFAULT_FILTERS,
      tier: ChefTier.CLASSICALLY_TRAINED,
    })).toBe(1);
  });

  it('counts dietary restrictions filter', () => {
    expect(discoveryService.countActiveFilters({
      ...DEFAULT_FILTERS,
      dietaryRestrictions: ['vegetarian'],
    })).toBe(1);
  });

  it('counts all active filters', () => {
    expect(discoveryService.countActiveFilters({
      cuisines: ['Italian'],
      budgetMin: 30,
      budgetMax: 200,
      tier: ChefTier.HOME_CHEF,
      dietaryRestrictions: ['vegan'],
    })).toBe(5);
  });
});

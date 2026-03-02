import { mockChefProfileRow } from '../../fixtures/chef-fixtures';

const mockFrom = jest.fn();

jest.mock('../../../src/config/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import * as chefProfileService from '../../../src/services/chef-profile-service';

function mockChainedQuery(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.single = jest.fn().mockResolvedValue({ data, error });
  chain.update = jest.fn().mockReturnValue(chain);
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

describe('getChefProfile', () => {
  it('fetches and maps chef profile by user ID', async () => {
    mockFrom.mockImplementation(() => mockChainedQuery(mockChefProfileRow));

    const result = await chefProfileService.getChefProfile('chef-456');

    expect(mockFrom).toHaveBeenCalledWith('chef_profiles');
    expect(result.id).toBe('chef-profile-1');
    expect(result.userId).toBe('chef-456');
    expect(result.tier).toBe('classically_trained');
    expect(result.cuisineSpecialties).toEqual(['Italian', 'French']);
  });

  it('throws when profile not found', async () => {
    mockFrom.mockImplementation(() =>
      mockChainedQuery(null, { message: 'Row not found' }),
    );

    await expect(chefProfileService.getChefProfile('bad-id')).rejects.toThrow(
      'Row not found',
    );
  });
});

describe('updateChefProfile', () => {
  it('updates chef profile fields', async () => {
    const chain = mockUpdateChain();
    mockFrom.mockImplementation(() => chain);

    await chefProfileService.updateChefProfile('chef-profile-1', {
      bio: 'Updated bio',
      cuisine_specialties: ['Italian', 'French', 'Japanese'],
    });

    expect(mockFrom).toHaveBeenCalledWith('chef_profiles');
    expect(chain.update).toHaveBeenCalledWith({
      bio: 'Updated bio',
      cuisine_specialties: ['Italian', 'French', 'Japanese'],
    });
  });

  it('throws on update error', async () => {
    const chain = mockUpdateChain({ message: 'Update failed' });
    mockFrom.mockImplementation(() => chain);

    await expect(
      chefProfileService.updateChefProfile('chef-profile-1', { bio: 'New' }),
    ).rejects.toThrow('Update failed');
  });
});

describe('setChefLive', () => {
  it('sets is_live to true', async () => {
    const chain = mockUpdateChain();
    mockFrom.mockImplementation(() => chain);

    await chefProfileService.setChefLive('chef-profile-1');

    expect(chain.update).toHaveBeenCalledWith({ is_live: true });
  });

  it('throws on error', async () => {
    const chain = mockUpdateChain({ message: 'Not authorized' });
    mockFrom.mockImplementation(() => chain);

    await expect(
      chefProfileService.setChefLive('chef-profile-1'),
    ).rejects.toThrow('Not authorized');
  });
});

import { mockAvailabilityRow, mockAvailabilityRow2 } from '../../fixtures/chef-fixtures';

const mockFrom = jest.fn();

jest.mock('../../../src/config/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import * as availabilityService from '../../../src/services/availability-service';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getAvailability', () => {
  it('fetches and maps availability slots for a chef', async () => {
    const chain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [mockAvailabilityRow2, mockAvailabilityRow],
        error: null,
      }),
    };
    mockFrom.mockReturnValue(chain);

    const result = await availabilityService.getAvailability('chef-profile-1');

    expect(mockFrom).toHaveBeenCalledWith('chef_availability');
    expect(result).toHaveLength(2);
    expect(result[0].dayOfWeek).toBe(0);
    expect(result[1].dayOfWeek).toBe(6);
    expect(result[0].chefId).toBe('chef-profile-1');
  });

  it('returns empty array when no availability set', async () => {
    const chain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const result = await availabilityService.getAvailability('chef-profile-1');
    expect(result).toEqual([]);
  });

  it('throws on fetch error', async () => {
    const chain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Query failed' },
      }),
    };
    mockFrom.mockReturnValue(chain);

    await expect(
      availabilityService.getAvailability('bad-id'),
    ).rejects.toThrow('Query failed');
  });
});

describe('setAvailability', () => {
  it('deletes existing and inserts new slots', async () => {
    const deleteChain = {
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    };
    const insertChain = {
      insert: jest.fn().mockResolvedValue({ error: null }),
    };

    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return deleteChain;
      return insertChain;
    });

    await availabilityService.setAvailability('chef-profile-1', [
      { day_of_week: 6, start_time: '10:00', end_time: '20:00' },
      { day_of_week: 0, start_time: '12:00', end_time: '18:00' },
    ]);

    expect(deleteChain.delete).toHaveBeenCalled();
    expect(insertChain.insert).toHaveBeenCalledWith([
      { chef_id: 'chef-profile-1', day_of_week: 6, start_time: '10:00', end_time: '20:00' },
      { chef_id: 'chef-profile-1', day_of_week: 0, start_time: '12:00', end_time: '18:00' },
    ]);
  });

  it('skips insert when slots array is empty', async () => {
    const deleteChain = {
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    };
    mockFrom.mockReturnValue(deleteChain);

    await availabilityService.setAvailability('chef-profile-1', []);

    expect(deleteChain.delete).toHaveBeenCalled();
    // mockFrom should only be called once (for delete), not a second time (for insert)
    expect(mockFrom).toHaveBeenCalledTimes(1);
  });

  it('throws on delete error', async () => {
    const deleteChain = {
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        error: { message: 'Delete failed' },
      }),
    };
    mockFrom.mockReturnValue(deleteChain);

    await expect(
      availabilityService.setAvailability('chef-profile-1', [
        { day_of_week: 1, start_time: '10:00', end_time: '20:00' },
      ]),
    ).rejects.toThrow('Delete failed');
  });

  it('throws on insert error', async () => {
    const deleteChain = {
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    };
    const insertChain = {
      insert: jest.fn().mockResolvedValue({
        error: { message: 'Insert failed' },
      }),
    };

    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return deleteChain;
      return insertChain;
    });

    await expect(
      availabilityService.setAvailability('chef-profile-1', [
        { day_of_week: 1, start_time: '10:00', end_time: '20:00' },
      ]),
    ).rejects.toThrow('Insert failed');
  });
});

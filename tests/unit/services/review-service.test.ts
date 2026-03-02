import { mockReviewRow, mockReviewRow2 } from '../../fixtures/review-fixtures';

const mockFrom = jest.fn();

jest.mock('../../../src/config/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import * as reviewService from '../../../src/services/review-service';

function mockInsertChain(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.insert = jest.fn().mockReturnValue(chain);
  chain.select = jest.fn().mockReturnValue(chain);
  chain.single = jest.fn().mockResolvedValue({ data, error });
  return chain;
}

function mockSelectListChain(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.order = jest.fn().mockResolvedValue({ data, error });
  return chain;
}

function mockMaybeSingleChain(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.maybeSingle = jest.fn().mockResolvedValue({ data, error });
  return chain;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createReview', () => {
  it('inserts a review and returns mapped result', async () => {
    mockFrom.mockImplementation(() => mockInsertChain(mockReviewRow));

    const result = await reviewService.createReview({
      bookingId: 'booking-1',
      reviewerId: 'user-123',
      revieweeId: 'chef-456',
      rating: 5,
      text: 'Incredible meal, highly recommend!',
    });

    expect(result.id).toBe('review-1');
    expect(result.rating).toBe(5);
    expect(result.reviewerId).toBe('user-123');
    expect(result.revieweeId).toBe('chef-456');
    expect(mockFrom).toHaveBeenCalledWith('reviews');
  });

  it('throws on insert error', async () => {
    mockFrom.mockImplementation(() =>
      mockInsertChain(null, { message: 'Insert failed' }),
    );

    await expect(
      reviewService.createReview({
        bookingId: 'b1',
        reviewerId: 'r1',
        revieweeId: 're1',
        rating: 5,
        text: 'Great',
      }),
    ).rejects.toThrow('Insert failed');
  });
});

describe('getReviewsForUser', () => {
  it('returns reviews for a user', async () => {
    mockFrom.mockImplementation(() =>
      mockSelectListChain([mockReviewRow, mockReviewRow2]),
    );

    const result = await reviewService.getReviewsForUser('chef-456');

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('review-1');
    expect(result[1].id).toBe('review-2');
    expect(mockFrom).toHaveBeenCalledWith('reviews');
  });

  it('returns empty array when no reviews', async () => {
    mockFrom.mockImplementation(() => mockSelectListChain([]));

    const result = await reviewService.getReviewsForUser('new-user');

    expect(result).toEqual([]);
  });

  it('throws on error', async () => {
    mockFrom.mockImplementation(() =>
      mockSelectListChain(null, { message: 'Query failed' }),
    );

    await expect(
      reviewService.getReviewsForUser('chef-456'),
    ).rejects.toThrow('Query failed');
  });
});

describe('getReviewForBooking', () => {
  it('returns a review when it exists', async () => {
    mockFrom.mockImplementation(() => mockMaybeSingleChain(mockReviewRow));

    const result = await reviewService.getReviewForBooking('booking-1', 'user-123');

    expect(result).not.toBeNull();
    expect(result!.id).toBe('review-1');
    expect(result!.bookingId).toBe('booking-1');
    expect(mockFrom).toHaveBeenCalledWith('reviews');
  });

  it('returns null when no review exists', async () => {
    mockFrom.mockImplementation(() => mockMaybeSingleChain(null));

    const result = await reviewService.getReviewForBooking('booking-99', 'user-123');

    expect(result).toBeNull();
  });

  it('throws on error', async () => {
    mockFrom.mockImplementation(() =>
      mockMaybeSingleChain(null, { message: 'Query failed' }),
    );

    await expect(
      reviewService.getReviewForBooking('booking-1', 'user-123'),
    ).rejects.toThrow('Query failed');
  });
});

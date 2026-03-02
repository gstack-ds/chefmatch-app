import { mockSwipeRowLike, mockSwipeRowPass, mockConversationRow } from '../../fixtures/consumer-fixtures';

const mockFrom = jest.fn();

jest.mock('../../../src/config/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import * as swipeService from '../../../src/services/swipe-service';
import { SwipeDirection } from '../../../src/config/constants';

function mockInsertChain(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.insert = jest.fn().mockReturnValue(chain);
  chain.select = jest.fn().mockReturnValue(chain);
  chain.single = jest.fn().mockResolvedValue({ data, error });
  return chain;
}

function mockSelectChain(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockResolvedValue({ data, error });
  return chain;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('recordSwipe', () => {
  it('creates swipe and conversation on like', async () => {
    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return mockInsertChain(mockSwipeRowLike);
      return mockInsertChain(mockConversationRow);
    });

    const result = await swipeService.recordSwipe(
      'consumer-profile-1',
      'chef-profile-1',
      SwipeDirection.LIKE,
    );

    expect(result.swipe.id).toBe('swipe-1');
    expect(result.swipe.direction).toBe('like');
    expect(result.conversation).not.toBeNull();
    expect(result.conversation!.id).toBe('conversation-1');
    expect(mockFrom).toHaveBeenCalledTimes(2);
    expect(mockFrom).toHaveBeenNthCalledWith(1, 'swipes');
    expect(mockFrom).toHaveBeenNthCalledWith(2, 'conversations');
  });

  it('creates only swipe on pass (no conversation)', async () => {
    mockFrom.mockImplementation(() => mockInsertChain(mockSwipeRowPass));

    const result = await swipeService.recordSwipe(
      'consumer-profile-1',
      'chef-profile-2',
      SwipeDirection.PASS,
    );

    expect(result.swipe.id).toBe('swipe-2');
    expect(result.swipe.direction).toBe('pass');
    expect(result.conversation).toBeNull();
    expect(mockFrom).toHaveBeenCalledTimes(1);
    expect(mockFrom).toHaveBeenCalledWith('swipes');
  });

  it('throws when swipe insert fails', async () => {
    mockFrom.mockImplementation(() =>
      mockInsertChain(null, { message: 'Swipe insert failed' }),
    );

    await expect(
      swipeService.recordSwipe('consumer-profile-1', 'chef-profile-1', SwipeDirection.LIKE),
    ).rejects.toThrow('Swipe insert failed');
  });

  it('throws when conversation insert fails', async () => {
    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return mockInsertChain(mockSwipeRowLike);
      return mockInsertChain(null, { message: 'Conversation insert failed' });
    });

    await expect(
      swipeService.recordSwipe('consumer-profile-1', 'chef-profile-1', SwipeDirection.LIKE),
    ).rejects.toThrow('Conversation insert failed');
  });
});

describe('getSwipedChefIds', () => {
  it('returns array of chef IDs', async () => {
    mockFrom.mockImplementation(() =>
      mockSelectChain([{ chef_id: 'chef-1' }, { chef_id: 'chef-2' }]),
    );

    const result = await swipeService.getSwipedChefIds('consumer-profile-1');

    expect(result).toEqual(['chef-1', 'chef-2']);
    expect(mockFrom).toHaveBeenCalledWith('swipes');
  });

  it('returns empty array when no swipes', async () => {
    mockFrom.mockImplementation(() => mockSelectChain([]));

    const result = await swipeService.getSwipedChefIds('consumer-profile-1');

    expect(result).toEqual([]);
  });

  it('throws on error', async () => {
    mockFrom.mockImplementation(() =>
      mockSelectChain(null, { message: 'Query failed' }),
    );

    await expect(
      swipeService.getSwipedChefIds('consumer-profile-1'),
    ).rejects.toThrow('Query failed');
  });
});

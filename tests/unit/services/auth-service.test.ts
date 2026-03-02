import { mockSession, mockUserRow, mockChefUserRow } from '../../fixtures/auth-fixtures';
import { ChefTier } from '../../../src/config/constants';

// Mock the supabase client before importing auth-service
const mockSignUp = jest.fn();
const mockSignInWithPassword = jest.fn();
const mockSignOut = jest.fn();
const mockGetSession = jest.fn();
const mockOnAuthStateChange = jest.fn();
const mockFrom = jest.fn();

jest.mock('../../../src/config/supabase', () => ({
  supabase: {
    auth: {
      signUp: (...args: unknown[]) => mockSignUp(...args),
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
      getSession: (...args: unknown[]) => mockGetSession(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
    },
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import * as authService from '../../../src/services/auth-service';

function mockChainedQuery(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.insert = jest.fn().mockReturnValue({ error });
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.single = jest.fn().mockResolvedValue({ data, error });
  return chain;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('signUp', () => {
  it('creates auth user, users row, and consumer profile for consumer role', async () => {
    mockSignUp.mockResolvedValue({
      data: { session: mockSession, user: mockSession.user },
      error: null,
    });

    // First from('users').insert() — create user row
    const usersInsertChain = { error: null };
    // Second from('consumer_profiles').insert() — create consumer profile
    const consumerInsertChain = { error: null };
    // Third from('users').select().eq().single() — fetch user profile
    const userSelectChain = mockChainedQuery(mockUserRow);

    let fromCallCount = 0;
    mockFrom.mockImplementation((table: string) => {
      fromCallCount++;
      if (table === 'users' && fromCallCount === 1) {
        return { insert: jest.fn().mockResolvedValue(usersInsertChain) };
      }
      if (table === 'consumer_profiles') {
        return { insert: jest.fn().mockResolvedValue(consumerInsertChain) };
      }
      // users select for getUserProfile
      return userSelectChain;
    });

    const result = await authService.signUp({
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User',
      role: 'consumer',
    });

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.session).toEqual(mockSession);
    expect(result.user.displayName).toBe('Test User');
  });

  it('creates chef profile with tier for chef role', async () => {
    mockSignUp.mockResolvedValue({
      data: { session: mockSession, user: { ...mockSession.user, id: 'chef-456' } },
      error: null,
    });

    let fromCallCount = 0;
    mockFrom.mockImplementation((table: string) => {
      fromCallCount++;
      if (table === 'users' && fromCallCount === 1) {
        return { insert: jest.fn().mockResolvedValue({ error: null }) };
      }
      if (table === 'chef_profiles') {
        const insertMock = jest.fn().mockResolvedValue({ error: null });
        return { insert: insertMock };
      }
      return mockChainedQuery(mockChefUserRow);
    });

    const result = await authService.signUp({
      email: 'chef@example.com',
      password: 'password123',
      displayName: 'Test Chef',
      role: 'chef',
      chefTier: ChefTier.CLASSICALLY_TRAINED,
    });

    expect(result.user.role).toBe('chef');
  });

  it('throws on auth error', async () => {
    mockSignUp.mockResolvedValue({
      data: { session: null, user: null },
      error: { message: 'Email already registered' },
    });

    await expect(authService.signUp({
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User',
      role: 'consumer',
    })).rejects.toThrow('Email already registered');
  });

  it('throws when no session returned', async () => {
    mockSignUp.mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    });

    await expect(authService.signUp({
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User',
      role: 'consumer',
    })).rejects.toThrow('Sign up failed: no session returned');
  });
});

describe('signIn', () => {
  it('returns session and user profile on success', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { session: mockSession, user: mockSession.user },
      error: null,
    });
    mockFrom.mockImplementation(() => mockChainedQuery(mockUserRow));

    const result = await authService.signIn({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.session).toEqual(mockSession);
    expect(result.user.email).toBe('test@example.com');
  });

  it('throws on invalid credentials', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { session: null, user: null },
      error: { message: 'Invalid login credentials' },
    });

    await expect(authService.signIn({
      email: 'test@example.com',
      password: 'wrong',
    })).rejects.toThrow('Invalid login credentials');
  });
});

describe('signOut', () => {
  it('signs out successfully', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    await expect(authService.signOut()).resolves.toBeUndefined();
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('throws on sign out error', async () => {
    mockSignOut.mockResolvedValue({ error: { message: 'Network error' } });

    await expect(authService.signOut()).rejects.toThrow('Network error');
  });
});

describe('getSession', () => {
  it('returns session when one exists', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const session = await authService.getSession();
    expect(session).toEqual(mockSession);
  });

  it('returns null when no session exists', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const session = await authService.getSession();
    expect(session).toBeNull();
  });
});

describe('getUserProfile', () => {
  it('fetches and maps user profile', async () => {
    mockFrom.mockImplementation(() => mockChainedQuery(mockUserRow));

    const user = await authService.getUserProfile('user-123');

    expect(user.id).toBe('user-123');
    expect(user.displayName).toBe('Test User');
    expect(user.role).toBe('consumer');
  });

  it('throws on fetch error', async () => {
    mockFrom.mockImplementation(() => mockChainedQuery(null, { message: 'Not found' }));

    await expect(authService.getUserProfile('bad-id')).rejects.toThrow('Not found');
  });
});

describe('onAuthStateChange', () => {
  it('subscribes to auth state changes', () => {
    const callback = jest.fn();
    const mockSubscription = { data: { subscription: { unsubscribe: jest.fn() } } };
    mockOnAuthStateChange.mockReturnValue(mockSubscription);

    const result = authService.onAuthStateChange(callback);

    expect(mockOnAuthStateChange).toHaveBeenCalledWith(callback);
    expect(result).toEqual(mockSubscription);
  });
});

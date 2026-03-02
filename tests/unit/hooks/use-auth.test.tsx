import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { mockSession, mockUserRow } from '../../fixtures/auth-fixtures';

const mockAuthSignUp = jest.fn();
const mockAuthSignIn = jest.fn();
const mockAuthSignOut = jest.fn();
const mockGetSession = jest.fn();
const mockGetUserProfile = jest.fn();
const mockOnAuthStateChange = jest.fn();

jest.mock('../../../src/services/auth-service', () => ({
  signUp: (...args: unknown[]) => mockAuthSignUp(...args),
  signIn: (...args: unknown[]) => mockAuthSignIn(...args),
  signOut: (...args: unknown[]) => mockAuthSignOut(...args),
  getSession: (...args: unknown[]) => mockGetSession(...args),
  getUserProfile: (...args: unknown[]) => mockGetUserProfile(...args),
  onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
}));

import { AuthProvider, useAuth } from '../../../src/hooks/use-auth';
import { mapUserRow } from '../../../src/utils/mappers';

const mockUserProfile = mapUserRow(mockUserRow);

function createWrapper() {
  return ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSession.mockResolvedValue(null);
  mockOnAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: jest.fn() } },
  });
});

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider',
    );
    spy.mockRestore();
  });

  it('starts in loading state with no user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();

    // Wait for session check to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('restores existing session on mount', async () => {
    mockGetSession.mockResolvedValue(mockSession);
    mockGetUserProfile.mockResolvedValue(mockUserProfile);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUserProfile);
    expect(result.current.session).toEqual(mockSession);
  });

  it('handles session restoration failure gracefully', async () => {
    mockGetSession.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('signUp sets user and session on success', async () => {
    mockAuthSignUp.mockResolvedValue({
      session: mockSession,
      user: mockUserProfile,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.signUp({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
        role: 'consumer',
      });
    });

    expect(result.current.user).toEqual(mockUserProfile);
    expect(result.current.session).toEqual(mockSession);
    expect(result.current.error).toBeNull();
  });

  it('signUp sets error on failure', async () => {
    mockAuthSignUp.mockRejectedValue(new Error('Email already registered'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.signUp({
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User',
          role: 'consumer',
        });
      } catch {
        // Expected
      }
    });

    expect(result.current.error).toBe('Email already registered');
    expect(result.current.user).toBeNull();
  });

  it('signIn sets user and session on success', async () => {
    mockAuthSignIn.mockResolvedValue({
      session: mockSession,
      user: mockUserProfile,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(result.current.user).toEqual(mockUserProfile);
    expect(result.current.session).toEqual(mockSession);
  });

  it('signIn sets error on failure', async () => {
    mockAuthSignIn.mockRejectedValue(new Error('Invalid login credentials'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.signIn({
          email: 'test@example.com',
          password: 'wrong',
        });
      } catch {
        // Expected
      }
    });

    expect(result.current.error).toBe('Invalid login credentials');
  });

  it('signOut clears user and session', async () => {
    // Start with a session
    mockGetSession.mockResolvedValue(mockSession);
    mockGetUserProfile.mockResolvedValue(mockUserProfile);
    mockAuthSignOut.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUserProfile);
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
  });

  it('clearError resets the error state', async () => {
    mockAuthSignIn.mockRejectedValue(new Error('Some error'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.signIn({ email: 'a@b.com', password: 'x' });
      } catch {
        // Expected
      }
    });

    expect(result.current.error).toBe('Some error');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('subscribes to auth state changes and cleans up', async () => {
    const unsubscribe = jest.fn();
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe } },
    });

    const { unmount } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });

    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});

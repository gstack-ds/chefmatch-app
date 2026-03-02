import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserProfile } from '../models/types';
import {
  SignUpParams,
  signUp as authSignUp,
  signIn as authSignIn,
  signOut as authSignOut,
  getSession,
  getUserProfile,
  onAuthStateChange,
} from '../services/auth-service';

interface AuthContextValue {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signUp: (params: SignUpParams) => Promise<void>;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Restore existing session on mount
    getSession()
      .then((existingSession) => {
        if (existingSession) {
          setSession(existingSession);
          return getUserProfile(existingSession.user.id);
        }
        return null;
      })
      .then((profile) => {
        if (profile) setUser(profile);
      })
      .catch(() => {
        // Session restoration failed — start fresh
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Subscribe to auth state changes
    const { data: { subscription } } = onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (params: SignUpParams) => {
    setError(null);
    try {
      const result = await authSignUp(params);
      setSession(result.session);
      setUser(result.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw err;
    }
  }, []);

  const signIn = useCallback(async (params: { email: string; password: string }) => {
    setError(null);
    try {
      const result = await authSignIn(params);
      setSession(result.session);
      setUser(result.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await authSignOut();
      setSession(null);
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, error, signUp, signIn, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

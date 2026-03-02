import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { ChefTier } from '../config/constants';
import { UserProfile } from '../models/types';
import { mapUserRow } from '../utils/mappers';

export interface SignUpParams {
  email: string;
  password: string;
  displayName: string;
  role: 'chef' | 'consumer';
  chefTier?: ChefTier;
}

export async function signUp(params: SignUpParams): Promise<{ session: Session; user: UserProfile }> {
  const { email, password, displayName, role, chefTier } = params;

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw new Error(authError.message);
  if (!authData.session || !authData.user) {
    throw new Error('Sign up failed: no session returned');
  }

  const userId = authData.user.id;

  // 2. Create users row
  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: userId,
      email,
      display_name: displayName,
      role,
    });

  if (userError) throw new Error(userError.message);

  // 3. Create role-specific profile
  // TODO: Migrate to Supabase RPC for atomic transaction once project is live
  if (role === 'chef') {
    const { error: chefError } = await supabase
      .from('chef_profiles')
      .insert({
        user_id: userId,
        tier: chefTier ?? ChefTier.HOME_CHEF,
      });

    if (chefError) throw new Error(chefError.message);
  } else {
    const { error: consumerError } = await supabase
      .from('consumer_profiles')
      .insert({
        user_id: userId,
      });

    if (consumerError) throw new Error(consumerError.message);
  }

  // 4. Fetch the created user profile
  const user = await getUserProfile(userId);

  return { session: authData.session, user };
}

export async function signIn(params: {
  email: string;
  password: string;
}): Promise<{ session: Session; user: UserProfile }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });

  if (error) throw new Error(error.message);
  if (!data.session) throw new Error('Sign in failed: no session returned');

  const user = await getUserProfile(data.user.id);

  return { session: data.session, user };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);
  return mapUserRow(data);
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  return supabase.auth.onAuthStateChange(callback);
}

import { supabase } from './supabase';
import { User } from '@/types/auth';

/**
 * Service to manage authentication flows with Supabase Auth
 */
export const authService = {
  /**
   * Sign in user with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign up a new user and create their profile metadata
   */
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign out current user and clear local session keys
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get active session profile data mapped to custom User model
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    // Fetch user profile from profiles table to load streak / XP
    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Fallback model if database profiles record isn't fully set up yet
    return {
      id: user.id,
      email: user.email || '',
      name: profile?.name || user.user_metadata?.name || 'Study Buddy',
      avatarUrl: profile?.avatar_url || '🎓',
      createdAt: user.created_at,
      xp: profile?.xp || 100,
      streak: profile?.streak || 1,
      lastStudyDate: profile?.last_study_date,
    };
  },

  /**
   * Trigger email password recovery link
   */
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'studybuddy://reset-password',
    });

    if (error) throw error;
    return data;
  },

  /**
   * Update current user password
   */
  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
    return data;
  },
};

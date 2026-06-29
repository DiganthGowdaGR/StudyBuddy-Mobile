import { create } from 'zustand';
import { User } from '@/types/auth';
import { storage } from '@/services/storage';
import { authService } from '@/services/authService';
import { dbService } from '@/services/dbService';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOffline: boolean;
  setIsOffline: (isOffline: boolean) => void;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserXP: (xp: number) => void;
  incrementStreak: () => void;
  setLoading: (isLoading: boolean) => void;
  syncUserSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isOffline: false,
  setIsOffline: (isOffline) => set({ isOffline }),

  login: async (user, token) => {
    set({ isLoading: true });
    await storage.setItem('auth_token', token);
    await storage.setItem('auth_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });

    // Sync database profile in background
    try {
      await dbService.updateProfile(user.id, user);
    } catch (e) {
      console.warn('Backend profile sync deferred', e);
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
    } catch (e) {
      console.warn('Supabase logout deferred, wiping local state', e);
    }
    await storage.deleteItem('auth_token');
    await storage.deleteItem('auth_user');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  updateUserXP: (xp) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, xp: state.user.xp + xp };
      
      // Update local cache
      storage.setItem('auth_user', JSON.stringify(updatedUser));
      
      // Sync remote database
      dbService.updateProfile(state.user.id, updatedUser).then(() => {
        set({ isOffline: false });
      }).catch((e) => {
        console.warn('Remote XP sync deferred', e.message);
        set({ isOffline: true });
      });

      return { user: updatedUser };
    });
  },

  incrementStreak: () => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        streak: state.user.streak + 1,
        lastStudyDate: new Date().toISOString()
      };
      
      // Update local cache
      storage.setItem('auth_user', JSON.stringify(updatedUser));
      
      // Sync remote database
      dbService.updateProfile(state.user.id, updatedUser).then(() => {
        set({ isOffline: false });
      }).catch((e) => {
        console.warn('Remote streak sync deferred', e.message);
        set({ isOffline: true });
      });

      return { user: updatedUser };
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  syncUserSession: async () => {
    set({ isLoading: true });
    try {
      const activeUser = await authService.getCurrentUser();
      if (activeUser) {
        const token = await storage.getItem('auth_token');
        set({ user: activeUser, token, isAuthenticated: true });
      }
    } catch (e) {
      console.warn('Session sync failed', e);
    } finally {
      set({ isLoading: false });
    }
  },
}));

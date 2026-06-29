import { create } from 'zustand';
import { User } from '@/types/auth';
import { storage } from '@/services/storage';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserXP: (xp: number) => void;
  incrementStreak: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (user, token) => {
    set({ isLoading: true });
    await storage.setItem('auth_token', token);
    await storage.setItem('auth_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    set({ isLoading: true });
    await storage.deleteItem('auth_token');
    await storage.deleteItem('auth_user');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  updateUserXP: (xp) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, xp: state.user.xp + xp };
      storage.setItem('auth_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  incrementStreak: () => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, streak: state.user.streak + 1, lastStudyDate: new Date().toISOString() };
      storage.setItem('auth_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

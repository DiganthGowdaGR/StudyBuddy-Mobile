import { create } from 'zustand';
import { ThemeMode } from '@/types/theme';
import { storage } from '@/services/storage';

interface SettingsStore {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  dailyGoalMinutes: number;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setDailyGoalMinutes: (minutes: number) => Promise<void>;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  themeMode: 'system',
  notificationsEnabled: true,
  dailyGoalMinutes: 30,

  setThemeMode: async (themeMode) => {
    set({ themeMode });
    await storage.setItem('settings_theme_mode', themeMode);
  },

  setNotificationsEnabled: async (notificationsEnabled) => {
    set({ notificationsEnabled });
    await storage.setItem('settings_notifications', JSON.stringify(notificationsEnabled));
  },

  setDailyGoalMinutes: async (dailyGoalMinutes) => {
    set({ dailyGoalMinutes });
    await storage.setItem('settings_daily_goal', dailyGoalMinutes.toString());
  },

  loadSettings: async () => {
    try {
      const themeMode = (await storage.getItem('settings_theme_mode')) as ThemeMode || 'system';
      const notifs = await storage.getItem('settings_notifications');
      const goal = await storage.getItem('settings_daily_goal');

      set({
        themeMode,
        notificationsEnabled: notifs !== null ? JSON.parse(notifs) : true,
        dailyGoalMinutes: goal !== null ? parseInt(goal, 10) : 30,
      });
    } catch (e) {
      console.error('Error loading settings', e);
    }
  },
}));

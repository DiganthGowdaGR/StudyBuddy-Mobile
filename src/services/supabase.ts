import { createClient } from '@supabase/supabase-js';
import { storage } from '@/services/storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: async (key: string) => {
        try {
          return await storage.getItem(key);
        } catch {
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          await storage.setItem(key, value);
        } catch (e) {
          console.error('Supabase storage setItem failed', e);
        }
      },
      removeItem: async (key: string) => {
        try {
          await storage.deleteItem(key);
        } catch (e) {
          console.error('Supabase storage removeItem failed', e);
        }
      }
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
});

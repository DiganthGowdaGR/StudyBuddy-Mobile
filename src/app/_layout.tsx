import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import AppTabs from '@/components/app-tabs';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated } = useAuthStore();
  const { loadSettings } = useSettingsStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function initApp() {
      try {
        await loadSettings();
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setAppReady(true);
      }
    }
    initApp();
  }, []);

  useEffect(() => {
    if (!appReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        router.replace('/(auth)/splash');
      }
    } else {
      if (inAuthGroup) {
        router.replace('/');
      }
    }
  }, [isAuthenticated, segments, appReady]);

  const currentTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const inAuthGroup = segments[0] === '(auth)';

  return (
    <ThemeProvider value={currentTheme}>
      {inAuthGroup ? (
        <Slot />
      ) : isAuthenticated ? (
        <AppTabs />
      ) : (
        <Slot />
      )}
    </ThemeProvider>
  );
}

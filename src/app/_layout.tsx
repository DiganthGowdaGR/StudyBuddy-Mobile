import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';

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
      if (inAuthGroup || !segments[0]) {
        router.replace('/(tabs)/home');
      }
    }
  }, [isAuthenticated, segments, appReady]);

  const currentTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={currentTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
        <Stack.Screen name="note-editor" />
        <Stack.Screen name="flashcards-review" />
        <Stack.Screen name="flashcards-create" options={{ presentation: 'modal' }} />
        <Stack.Screen name="focus-session" />
        <Stack.Screen name="analytics" />
      </Stack>
    </ThemeProvider>
  );
}

import React from 'react';
import { Pressable, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ScreenContainer, Typography, Card, Header, Icon, Button } from '@/components/ui';

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { themeMode, setThemeMode, notificationsEnabled, setNotificationsEnabled, dailyGoalMinutes } = useSettingsStore();

  const handleLogout = async () => {
    await logout();
  };

  const handleClose = () => {
    router.back();
  };

  const toggleTheme = async () => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
    await setThemeMode(nextTheme);
  };

  const toggleNotifications = async () => {
    await setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <ScreenContainer safeArea={false} className="bg-white dark:bg-secondary-950 flex-1">
      <Header
        title="Settings"
        rightAction={
          <Pressable
            onPress={handleClose}
            className="p-2 rounded-full active:bg-secondary-100 dark:active:bg-secondary-900 justify-center items-center"
          >
            <Icon name="X" size={20} color="#64748b" />
          </Pressable>
        }
      />

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5 gap-4">
        <Card variant="outlined" className="p-4 flex-row justify-between items-center border-secondary-200 dark:border-secondary-800">
          <View className="flex-row items-center gap-3">
            <Icon name="Moon" size={20} color="#8b5cf6" />
            <Typography variant="body" className="font-bold">Dark Mode</Typography>
          </View>

          <Switch
            value={themeMode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#cbd5e1', true: '#c4b5fd' }}
            thumbColor={themeMode === 'dark' ? '#8b5cf6' : '#f4f3f4'}
          />
        </Card>

        <Card variant="outlined" className="p-4 flex-row justify-between items-center border-secondary-200 dark:border-secondary-800">
          <View className="flex-row items-center gap-3">
            <Icon name="Bell" size={20} color="#8b5cf6" />
            <Typography variant="body" className="font-bold">Push Notifications</Typography>
          </View>

          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#cbd5e1', true: '#c4b5fd' }}
            thumbColor={notificationsEnabled ? '#8b5cf6' : '#f4f3f4'}
          />
        </Card>

        <Card variant="outlined" className="p-4 flex-row justify-between items-center border-secondary-200 dark:border-secondary-800">
          <View className="flex-row items-center gap-3">
            <Icon name="Target" size={20} color="#8b5cf6" />
            <Typography variant="body" className="font-bold">Daily Study Goal</Typography>
          </View>
          
          <Typography variant="body" className="font-extrabold text-primary-500">
            {dailyGoalMinutes} mins
          </Typography>
        </Card>

        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="danger"
          className="mt-6 shadow-lg shadow-danger-500/10"
        />
      </ScreenContainer>
    </ScreenContainer>
  );
}

import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ScreenContainer, Typography, Card, Header, Icon, Button, Badge } from '@/components/ui';

const VOICE_PRESETS = [
  { id: 'emma', name: 'Emma (Friendly)', desc: 'Warm and conversational' },
  { id: 'arthur', name: 'Arthur (Sage)', desc: 'Calm and academic' },
  { id: 'sophia', name: 'Sophia (Coach)', desc: 'Energetic and motivating' }
];

const LANGUAGE_LOCALES = [
  { code: 'en', label: 'English (US)' },
  { code: 'es', label: 'Spanish (ES)' },
  { code: 'de', label: 'German (DE)' }
];

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  
  const {
    themeMode,
    setThemeMode,
    notificationsEnabled,
    setNotificationsEnabled,
    dailyGoalMinutes
  } = useSettingsStore();

  // Local settings for mock criteria
  const [selectedVoice, setSelectedVoice] = useState('emma');
  const [selectedLang, setSelectedLang] = useState('en');
  const [shareStats, setShareStats] = useState(true);
  const [anonAnalytics, setAnonAnalytics] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    setTimeout(async () => {
      await logout();
      setLoading(false);
    }, 1000);
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

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5 gap-5 pb-8">
        
        {/* Core preferences togglers */}
        <View className="gap-3.5">
          <Typography variant="label">Preferences</Typography>
          
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
        </View>

        {/* Voice preferences */}
        <View className="gap-3">
          <Typography variant="label">AI Sensei Speech Voice</Typography>
          
          <View className="gap-2.5">
            {VOICE_PRESETS.map((v) => {
              const isSelected = selectedVoice === v.id;
              return (
                <Pressable key={v.id} onPress={() => setSelectedVoice(v.id)} className="active:scale-98">
                  <Card
                    variant={isSelected ? 'default' : 'outlined'}
                    className={`p-3.5 border ${
                      isSelected ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20' : 'border-secondary-200 dark:border-secondary-800'
                    }`}
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Typography variant="body" className="font-black">{v.name}</Typography>
                        <Typography variant="caption" className="text-secondary-400 font-bold mt-0.5">{v.desc}</Typography>
                      </View>
                      {isSelected && <Icon name="CheckCircle" size={16} color="#8b5cf6" />}
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Language preference */}
        <View className="gap-3">
          <Typography variant="label">Language Locale</Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5 py-0.5 gap-2">
            {LANGUAGE_LOCALES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <Pressable key={lang.code} onPress={() => setSelectedLang(lang.code)} className="mr-2 active:scale-95">
                  <Badge
                    label={lang.label}
                    variant={isSelected ? 'primary' : 'neutral'}
                    type={isSelected ? 'solid' : 'subtle'}
                    className="py-2 px-4 rounded-xl border border-secondary-200/10"
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Privacy options */}
        <View className="gap-3.5">
          <Typography variant="label">Privacy & Sharing</Typography>
          
          <Card variant="outlined" className="p-4 flex-row justify-between items-center border-secondary-200 dark:border-secondary-800">
            <View className="flex-row items-center gap-3 flex-1 mr-4">
              <Icon name="Users" size={20} color="#8b5cf6" />
              <View className="flex-1">
                <Typography variant="body" className="font-bold">Share Study Stats</Typography>
                <Typography variant="caption" className="text-secondary-400 font-bold mt-0.5">Let study buddies view your streaks</Typography>
              </View>
            </View>
            <Switch
              value={shareStats}
              onValueChange={setShareStats}
              trackColor={{ false: '#cbd5e1', true: '#c4b5fd' }}
              thumbColor={shareStats ? '#8b5cf6' : '#f4f3f4'}
            />
          </Card>

          <Card variant="outlined" className="p-4 flex-row justify-between items-center border-secondary-200 dark:border-secondary-800">
            <View className="flex-row items-center gap-3 flex-1 mr-4">
              <Icon name="Shield" size={20} color="#8b5cf6" />
              <View className="flex-1">
                <Typography variant="body" className="font-bold">Anonymized Analytics</Typography>
                <Typography variant="caption" className="text-secondary-400 font-bold mt-0.5">Helps improve Sensei tips metrics</Typography>
              </View>
            </View>
            <Switch
              value={anonAnalytics}
              onValueChange={setAnonAnalytics}
              trackColor={{ false: '#cbd5e1', true: '#c4b5fd' }}
              thumbColor={anonAnalytics ? '#8b5cf6' : '#f4f3f4'}
            />
          </Card>
        </View>

        {/* About App version info */}
        <View className="gap-3">
          <Typography variant="label">About StudyBuddy</Typography>
          <Card variant="flat" className="p-4 border border-transparent">
            <View className="flex-row justify-between items-center mb-2">
              <Typography variant="body" className="font-black">App Version</Typography>
              <Typography variant="body" className="font-extrabold text-secondary-500">1.0.0 (Hackathon Build)</Typography>
            </View>
            <View className="flex-row justify-between items-center">
              <Typography variant="body" className="font-black">Developers</Typography>
              <Typography variant="body" className="font-bold text-secondary-500">Diganth & Antigravity AI</Typography>
            </View>
          </Card>
        </View>

        {/* Logout action */}
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="danger"
          isLoading={loading}
          className="mt-6 shadow-lg shadow-danger-500/10"
        />
      </ScreenContainer>
    </ScreenContainer>
  );
}

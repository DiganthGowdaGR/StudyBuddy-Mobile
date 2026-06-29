import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { ScreenContainer, Typography, Card, Header, Icon, Button } from '@/components/ui';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const handleClose = () => {
    router.back();
  };

  return (
    <ScreenContainer safeArea={false} className="bg-white dark:bg-secondary-950 flex-1">
      <Header
        title="My Profile"
        rightAction={
          <Pressable
            onPress={handleClose}
            className="p-2 rounded-full active:bg-secondary-100 dark:active:bg-secondary-900 justify-center items-center"
          >
            <Icon name="X" size={20} color="#64748b" />
          </Pressable>
        }
      />

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5 items-center">
        <View className="w-24 h-24 rounded-full bg-primary-50 dark:bg-primary-950/20 justify-center items-center mb-4 border-2 border-primary-500 shadow-sm">
          <Typography className="text-5xl">{user?.avatarUrl || '🎓'}</Typography>
        </View>

        <Typography variant="h2" className="font-black mb-1 text-secondary-900 dark:text-white">
          {user?.name || 'Study Buddy'}
        </Typography>
        
        <Typography variant="body" color="muted" className="font-semibold text-secondary-500 mb-8">
          {user?.email || 'studybuddy@hackathon.com'}
        </Typography>

        <View className="flex-row gap-4 w-full mb-6">
          <Card variant="outlined" className="flex-1 p-4 items-center border-secondary-200 dark:border-secondary-800">
            <Icon name="Flame" size={24} color="#f59e0b" animate="pulse" />
            <Typography variant="h2" className="font-black mt-2 mb-0.5">
              {user?.streak || 1}
            </Typography>
            <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">
              Active Streak
            </Typography>
          </Card>

          <Card variant="outlined" className="flex-1 p-4 items-center border-secondary-200 dark:border-secondary-800">
            <Icon name="Award" size={24} color="#8b5cf6" animate="float" />
            <Typography variant="h2" className="font-black mt-2 mb-0.5">
              {user?.xp || 100}
            </Typography>
            <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">
              XP Earned
            </Typography>
          </Card>
        </View>

        <Card variant="flat" className="w-full mb-4 p-4 border border-transparent">
          <Typography variant="h4" className="font-black mb-3">Level Progression</Typography>
          <View className="w-full h-2 bg-secondary-200 dark:bg-secondary-800 rounded-full overflow-hidden mb-2">
            <View className="h-full bg-primary-500 w-[60%]" />
          </View>
          <View className="flex-row justify-between">
            <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">Level 2</Typography>
            <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">60% to Level 3</Typography>
          </View>
        </Card>

        <Button
          title="View Detailed Analytics"
          onPress={() => {
            router.back();
            setTimeout(() => {
              router.push('/analytics');
            }, 100);
          }}
          variant="outline"
          className="w-full rounded-xl py-3 mt-4 border-primary-500"
          leftIcon={<Icon name="TrendingUp" size={16} color="#8b5cf6" />}
        />
      </ScreenContainer>
    </ScreenContainer>
  );
}

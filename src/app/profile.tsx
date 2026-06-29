import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { ScreenContainer, Typography, Card, Header, Icon, Button, Badge } from '@/components/ui';

const BADGES = [
  { id: 'b1', title: 'Quick Learner', emoji: '🎓', desc: 'First card created' },
  { id: 'b2', title: 'Streak Master', emoji: '🔥', desc: '5 days active streak' },
  { id: 'b3', title: 'Focus Scholar', emoji: '⚡', desc: 'Focused for 3 hours' },
  { id: 'b4', title: 'AI Partner', emoji: '🤖', desc: 'Chatted with Sensei 10 times' },
];

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

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5 items-center pb-8 gap-5">
        
        {/* User avatar large details */}
        <View className="items-center">
          <View className="w-24 h-24 rounded-full bg-primary-50 dark:bg-primary-950/20 justify-center items-center mb-4 border-2 border-primary-500 shadow-sm">
            <Typography className="text-5xl">{user?.avatarUrl || '🎓'}</Typography>
          </View>
          <Typography variant="h2" className="font-black text-secondary-900 dark:text-white">
            {user?.name || 'Study Buddy'}
          </Typography>
          <Typography variant="body" color="muted" className="font-semibold text-secondary-500">
            {user?.email || 'studybuddy@hackathon.com'}
          </Typography>
        </View>

        {/* Level Progression */}
        <Card variant="flat" className="w-full p-4 border border-transparent">
          <View className="flex-row justify-between items-center mb-2">
            <Typography variant="h4" className="font-black">Level 2 Scholar</Typography>
            <Badge label="Active Rank 🌟" variant="primary" type="solid" className="px-2 py-0.5 rounded-lg" />
          </View>
          <View className="w-full h-2 bg-secondary-200 dark:bg-secondary-800 rounded-full overflow-hidden mb-2">
            <View className="h-full bg-primary-500 w-[60%]" />
          </View>
          <View className="flex-row justify-between">
            <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">150 XP</Typography>
            <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">100 XP to Level 3</Typography>
          </View>
        </Card>

        {/* Statistics Grid */}
        <View className="w-full gap-4">
          <Typography variant="label">Statistics</Typography>
          
          <View className="flex-row gap-4 w-full">
            <Card variant="outlined" className="flex-1 p-4 items-center border-secondary-200 dark:border-secondary-800">
              <Icon name="Flame" size={24} color="#f59e0b" animate="pulse" />
              <Typography variant="h2" className="font-black mt-2 mb-0.5">{user?.streak || 1}</Typography>
              <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">Study Streak</Typography>
            </Card>

            <Card variant="outlined" className="flex-1 p-4 items-center border-secondary-200 dark:border-secondary-800">
              <Icon name="Clock" size={24} color="#8b5cf6" className="mb-2" />
              <Typography variant="h2" className="font-black mt-2 mb-0.5">4.3h</Typography>
              <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">Study Hours</Typography>
            </Card>
          </View>
        </View>

        {/* Badges Grid */}
        <View className="w-full gap-3">
          <Typography variant="label">Unlocked Badges</Typography>
          <View className="flex-row flex-wrap justify-between gap-3">
            {BADGES.map((badge) => (
              <Card
                key={badge.id}
                variant="outlined"
                className="w-[47%] p-3 items-center border-secondary-200 dark:border-secondary-805"
              >
                <Typography className="text-3xl mb-2">{badge.emoji}</Typography>
                <Typography variant="bodySm" className="font-black text-center mb-0.5">{badge.title}</Typography>
                <Typography variant="caption" className="text-secondary-400 font-semibold text-center text-[8px]">{badge.desc}</Typography>
              </Card>
            ))}
          </View>
        </View>

        {/* Achievements Timeline */}
        <View className="w-full gap-3">
          <Typography variant="label">Scholar Achievements</Typography>
          <Card variant="default" className="border border-secondary-100 dark:border-secondary-800 p-4 gap-4">
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-success-50 dark:bg-success-950/20 justify-center items-center">
                <Icon name="Check" size={14} color="#10b981" />
              </View>
              <View className="flex-1">
                <Typography variant="body" className="font-bold">Completed Onboarding Wizard</Typography>
                <Typography variant="caption" className="text-secondary-400 font-bold mt-0.5">Unlocked 1 day ago</Typography>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-success-50 dark:bg-success-950/20 justify-center items-center">
                <Icon name="Check" size={14} color="#10b981" />
              </View>
              <View className="flex-1">
                <Typography variant="body" className="font-bold">First Spaced Repetition deck reviewed</Typography>
                <Typography variant="caption" className="text-secondary-400 font-bold mt-0.5">Unlocked 2 hours ago</Typography>
              </View>
            </View>
          </Card>
        </View>

        {/* Detailed Analytics redirect */}
        <Button
          title="View Detailed Analytics"
          onPress={() => {
            router.back();
            setTimeout(() => {
              router.push('/analytics');
            }, 100);
          }}
          variant="outline"
          className="w-full rounded-xl py-3 border-primary-500 mt-2"
          leftIcon={<Icon name="TrendingUp" size={16} color="#8b5cf6" />}
        />
      </ScreenContainer>
    </ScreenContainer>
  );
}

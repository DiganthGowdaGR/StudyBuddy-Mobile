import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer, Typography, Card, Header, Section, Icon, Avatar, Badge } from '@/components/ui';
import { useAuthStore } from '@/store/useAuthStore';

export default function LibraryScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const rightHeaderActions = (
    <View className="flex-row items-center gap-3">
      <Pressable
        onPress={() => router.push('/profile')}
        className="rounded-full active:opacity-70 justify-center items-center"
      >
        <Avatar name={user?.name || 'Study Buddy'} size="sm" border />
      </Pressable>
      
      <Pressable
        onPress={() => router.push('/settings')}
        className="p-2 rounded-full active:bg-secondary-100 dark:active:bg-secondary-900 justify-center items-center"
      >
        <Icon name="Settings" size={20} color="#64748b" />
      </Pressable>
    </View>
  );

  return (
    <ScreenContainer safeArea={false} className="bg-secondary-50 dark:bg-secondary-950 flex-1">
      <Header title="Study Library" rightAction={rightHeaderActions} />

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5">
        <Card variant="glass" className="mb-6 border border-primary-100/10">
          <View className="flex-row justify-between items-center">
            <View>
              <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">
                DAILY STUDY STREAK
              </Typography>
              <Typography variant="h2" className="font-black mt-1">
                🔥 {user?.streak || 1} Days Active
              </Typography>
            </View>

            <View className="items-end">
              <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">
                TOTAL EXPERIENCE
              </Typography>
              <Typography variant="h2" className="font-black text-primary-500 mt-1">
                ✨ {user?.xp || 100} XP
              </Typography>
            </View>
          </View>
        </Card>

        <Section title="My Topics">
          <View className="flex-row flex-wrap gap-2">
            <Badge label="Computer Science" variant="primary" type="subtle" />
            <Badge label="Mathematics" variant="success" type="subtle" />
            <Badge label="Medicine & Biology" variant="warning" type="subtle" />
            <Badge label="Languages" variant="info" type="subtle" />
          </View>
        </Section>

        <Section
          title="Recent Decks"
          actionLabel="View Decks"
          onActionPress={() => router.push('/(tabs)/cards')}
        >
          <Card
            onPress={() => router.push('/(tabs)/cards')}
            header="React Native & TS Architecture"
            footer="25 Cards • Last studied 2h ago"
            className="mb-4 border border-secondary-100 dark:border-secondary-800"
          >
            <Typography variant="body" color="secondary" className="font-medium text-secondary-500">
              Overview of navigation systems, custom hooks, and state persistence stores.
            </Typography>
          </Card>

          <Card
            onPress={() => router.push('/(tabs)/cards')}
            header="Advanced Neural Networks"
            footer="18 Cards • Last studied 1d ago"
            className="border border-secondary-100 dark:border-secondary-800"
          >
            <Typography variant="body" color="secondary" className="font-medium text-secondary-500">
              Covers backpropagation matrix multiplications and transformers layers.
            </Typography>
          </Card>
        </Section>
      </ScreenContainer>
    </ScreenContainer>
  );
}

import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import {
  ScreenContainer,
  Typography,
  Card,
  Header,
  Section,
  Icon,
  Avatar,
  Badge,
  ProgressRing,
  Button,
} from '@/components/ui';

const WEEK_DAYS = [
  { label: 'M', checked: true },
  { label: 'T', checked: true },
  { label: 'W', checked: false },
  { label: 'T', checked: false },
  { label: 'F', checked: false },
  { label: 'S', checked: false },
  { label: 'S', checked: false }
];

export default function HomeDashboardScreen() {
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

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScreenContainer safeArea={false} className="bg-secondary-50 dark:bg-secondary-950 flex-1">
      <Header
        title={`${getGreeting()}, ${user?.name || 'Buddy'}! 👋`}
        subtitle={new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        rightAction={rightHeaderActions}
      />

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5 gap-6">
        
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.push('/(tabs)/schedule')}
            className="flex-1 p-4 rounded-2xl bg-primary-500 items-center justify-center shadow-lg active:opacity-90"
          >
            <Icon name="Clock" size={22} color="#ffffff" className="mb-2" />
            <Typography variant="bodySm" className="text-white font-bold">Focus Timer</Typography>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/cards')}
            className="flex-1 p-4 rounded-2xl bg-white dark:bg-secondary-900 border border-secondary-100 dark:border-secondary-800 items-center justify-center active:bg-secondary-50"
          >
            <Icon name="Plus" size={22} color="#8b5cf6" className="mb-2" />
            <Typography variant="bodySm" className="font-bold text-secondary-900 dark:text-white">New Deck</Typography>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/sensei')}
            className="flex-1 p-4 rounded-2xl bg-white dark:bg-secondary-900 border border-secondary-100 dark:border-secondary-800 items-center justify-center active:bg-secondary-50"
          >
            <Icon name="Sparkles" size={22} color="#8b5cf6" className="mb-2" animate="float" />
            <Typography variant="bodySm" className="font-bold text-secondary-900 dark:text-white">Ask Sensei</Typography>
          </Pressable>
        </View>

        <Card variant="glass" className="border border-primary-100/10 p-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3.5 flex-1 mr-4">
              <ProgressRing progress={25 / 30} size={68} strokeWidth={7} />
              <View className="flex-1">
                <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">DAILY FOCUS GOAL</Typography>
                <Typography variant="h3" className="font-black mt-0.5">25 / 30 mins</Typography>
                <Typography variant="bodySm" color="secondary" className="font-semibold text-secondary-500 mt-1">Almost there! 5m left</Typography>
              </View>
            </View>

            <View className="w-[1px] h-12 bg-secondary-200 dark:bg-secondary-800 mx-2" />

            <View className="items-end pl-2">
              <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">STUDY STREAK</Typography>
              <Typography variant="h3" className="font-black text-orange-500 mt-0.5">🔥 {user?.streak || 1} Day</Typography>
              
              <View className="flex-row gap-1 mt-2.5">
                {WEEK_DAYS.map((day, idx) => (
                  <View
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full items-center justify-center border ${
                      day.checked
                        ? 'bg-orange-500 border-orange-500'
                        : 'bg-transparent border-secondary-300 dark:border-secondary-700'
                    }`}
                  >
                    <Typography className={`text-[7px] font-black ${day.checked ? 'text-white' : 'text-secondary-400'}`}>
                      {day.label}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Card>

        <Card variant="outlined" className="p-4 border-secondary-200 dark:border-secondary-800">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center gap-2">
              <Icon name="Zap" size={18} color="#8b5cf6" animate="pulse" />
              <Typography variant="h4" className="font-black text-secondary-900 dark:text-white">Focus Potential</Typography>
            </View>
            <Badge label="Optimal ⚡" variant="primary" type="solid" className="px-2 py-0.5 rounded-lg" />
          </View>

          <View className="flex-row justify-between items-center mb-2">
            <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">Level 2 Scholar</Typography>
            <Typography variant="bodySm" className="font-extrabold text-primary-500">100 / 250 XP</Typography>
          </View>

          <View className="w-full h-2 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden mb-3">
            <View className="h-full bg-primary-500 w-[40%]" />
          </View>

          <Typography variant="bodySm" color="secondary" className="font-semibold text-secondary-500 leading-relaxed">
            Your learning potential is at <Typography className="text-secondary-900 dark:text-white font-bold">92%</Typography>. You earn <Typography className="text-secondary-900 dark:text-white font-bold">1.5x XP</Typography> during focused Pomodoro intervals.
          </Typography>
        </Card>

        <Card variant="glass" className="border-secondary-100/50 bg-primary-50/50 dark:bg-primary-950/20 p-5">
          <View className="flex-row items-start gap-3">
            <View className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/50 justify-center items-center mt-0.5">
              <Icon name="Sparkles" size={18} color="#8b5cf6" animate="float" />
            </View>
            <View className="flex-1">
              <Typography variant="h4" className="font-extrabold text-primary-600 dark:text-primary-400">Sensei's Insights</Typography>
              <Typography variant="body" color="secondary" className="font-medium text-secondary-600 dark:text-secondary-300 mt-1 leading-relaxed">
                "You review flashcards 20% faster in the afternoon. Try setting aside 10 minutes at 3:00 PM today to review Spanish conjugations!"
              </Typography>
            </View>
          </View>
        </Card>

        <Section title="Continue Learning">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5 gap-3.5">
            <Card
              onPress={() => router.push('/(tabs)/cards')}
              header="React Native Navigation"
              footer="15 / 25 Cards Reviewed"
              className="w-64 border border-secondary-100 dark:border-secondary-800 mr-3"
            >
              <View className="w-full h-1 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden mb-3">
                <View className="h-full bg-primary-500 w-[60%]" />
              </View>
              <Button title="Resume Study" size="sm" className="w-full py-2.5 rounded-xl" />
            </Card>

            <Card
              onPress={() => router.push('/(tabs)/cards')}
              header="PostgreSQL Indexes"
              footer="6 / 18 Cards Reviewed"
              className="w-64 border border-secondary-100 dark:border-secondary-800 mr-8"
            >
              <View className="w-full h-1 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden mb-3">
                <View className="h-full bg-primary-500 w-[33%]" />
              </View>
              <Button title="Resume Study" size="sm" className="w-full py-2.5 rounded-xl" />
            </Card>
          </ScrollView>
        </Section>

        <Section title="Upcoming Today">
          <Card
            header={
              <View className="flex-row items-center w-full justify-between">
                <View className="flex-row items-center">
                  <Icon name="Calendar" size={16} color="#8b5cf6" className="mr-2" />
                  <Typography variant="h4" className="font-bold">Spanish Conjugations Review</Typography>
                </View>
                <Badge label="4:00 PM" variant="info" type="subtle" className="px-2 py-0.5 rounded-lg border-transparent" />
              </View>
            }
            className="border border-secondary-100 dark:border-secondary-800 mb-3"
          >
            <Typography variant="body" color="secondary" className="font-medium text-secondary-500">
              Practice B2 level conditional conjugations with Sensei AI helper.
            </Typography>
          </Card>
        </Section>

        <Section title="Recent Activity">
          <View className="gap-3.5 pl-1.5">
            <View className="flex-row items-start">
              <View className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 mr-3.5 z-10" />
              <View className="flex-1 pb-4 border-l border-secondary-200 dark:border-secondary-800 pl-4 -ml-[20px] -mt-1.5 pt-1">
                <Typography variant="body" className="font-bold text-secondary-900 dark:text-white">Focused on Computer Science</Typography>
                <Typography variant="bodySm" color="muted" className="mt-0.5 text-secondary-500 font-semibold">Pomodoro Session • 25 mins • +20 XP</Typography>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-2 h-2 rounded-full bg-success-500 mt-1.5 mr-3.5 z-10" />
              <View className="flex-1 pb-4 pl-4 -ml-[20px] -mt-1.5 pt-1">
                <Typography variant="body" className="font-bold text-secondary-900 dark:text-white">Completed AI Flashcard Review</Typography>
                <Typography variant="bodySm" color="muted" className="mt-0.5 text-secondary-500 font-semibold">12 Flashcards studied • +10 XP</Typography>
              </View>
            </View>
          </View>
        </Section>
        
      </ScreenContainer>
    </ScreenContainer>
  );
}

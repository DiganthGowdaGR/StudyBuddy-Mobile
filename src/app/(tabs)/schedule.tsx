import React from 'react';
import { View } from 'react-native';
import { ScreenContainer, Typography, Card, Header, Section, Icon, ProgressRing } from '@/components/ui';

const DAYS = [
  { day: 'Mon', date: 29, active: true },
  { day: 'Tue', date: 30, active: false },
  { day: 'Wed', date: 1, active: false },
  { day: 'Thu', date: 2, active: false },
  { day: 'Fri', date: 3, active: false },
  { day: 'Sat', date: 4, active: false },
  { day: 'Sun', date: 5, active: false }
];

export default function ScheduleScreen() {
  return (
    <ScreenContainer safeArea={false} className="bg-secondary-50 dark:bg-secondary-950 flex-1">
      <Header title="Study Planner" />

      <ScreenContainer scrollable safeArea={false} className="bg-transparent p-0 flex-1" contentContainerClassName="p-5">
        <View className="flex-row justify-between mb-6">
          {DAYS.map((item) => (
            <View
              key={item.day}
              className={`items-center p-2.5 rounded-xl border flex-1 mx-0.5 ${
                item.active ? 'bg-primary-500 border-primary-500 shadow-sm' : 'bg-white dark:bg-secondary-900 border-secondary-100 dark:border-secondary-800'
              }`}
            >
              <Typography
                variant="caption"
                className={`text-[9px] font-bold ${item.active ? 'text-white' : 'text-secondary-400'}`}
              >
                {item.day}
              </Typography>
              <Typography
                variant="h3"
                className={`font-black mt-1 ${item.active ? 'text-white' : 'text-secondary-900 dark:text-white'}`}
              >
                {item.date}
              </Typography>
            </View>
          ))}
        </View>

        <Card variant="glass" className="mb-6 border border-primary-100/10 p-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">
                DAILY STUDY TARGET
              </Typography>
              <Typography variant="h2" className="font-black mt-1">
                25 / 30 mins
              </Typography>
              <Typography variant="body" color="secondary" className="font-medium text-secondary-500 mt-1">
                You are almost there! 5 more minutes to keep your streak.
              </Typography>
            </View>

            <ProgressRing progress={25 / 30} size={76} strokeWidth={8} />
          </View>
        </Card>

        <Section title="Today's Schedule">
          <Card
            header={
              <View className="flex-row items-center">
                <Icon name="BookOpen" size={16} color="#8b5cf6" className="mr-2" />
                <Typography variant="h4" className="font-bold">React Native Architecture</Typography>
              </View>
            }
            footer="Duration: 45m • Priority: High"
            className="mb-4 border border-secondary-100 dark:border-secondary-800"
          >
            <Typography variant="body" color="secondary" className="font-medium text-secondary-500">
              Prepare the folder architecture structure and custom presets.
            </Typography>
          </Card>

          <Card
            header={
              <View className="flex-row items-center">
                <Icon name="Sparkles" size={16} color="#8b5cf6" className="mr-2" />
                <Typography variant="h4" className="font-bold">AI Sensei Tutoring Session</Typography>
              </View>
            }
            footer="Duration: 20m • Priority: Medium"
            className="border border-secondary-100 dark:border-secondary-800"
          >
            <Typography variant="body" color="secondary" className="font-medium text-secondary-500">
              Review backpropagation principles using quick custom chats.
            </Typography>
          </Card>
        </Section>
      </ScreenContainer>
    </ScreenContainer>
  );
}

import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/types/auth';
import { ScreenContainer, Typography, Input, Button, Badge, Card, Icon } from '@/components/ui';

const AVATAR_PRESETS = [
  '⚡', '🎓', '🤖', '🚀', '🎨', '🦁', '🌟', '🍀'
];

const SUBJECT_PRESETS = [
  'Computer Science', 'Mathematics', 'Languages',
  'Medicine & Biology', 'History', 'Physics & Chemistry',
  'Business & Finance', 'Literature'
];

const GOAL_PRESETS = [
  { minutes: 15, label: 'Casual' },
  { minutes: 30, label: 'Regular' },
  { minutes: 60, label: 'Serious' },
  { minutes: 90, label: 'Legendary' }
];

export default function ProfileSetupScreen() {
  const login = useAuthStore((state) => state.login);
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎓');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleFinish = async () => {
    if (!nickname.trim()) {
      setError('Please choose a nickname');
      return;
    }
    if (selectedSubjects.length === 0) {
      setError('Please select at least one study subject');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(async () => {
      const newUser: User = {
        id: Math.random().toString(36).substring(7),
        email: 'studybuddy@hackathon.com',
        name: nickname,
        avatarUrl: selectedAvatar,
        createdAt: new Date().toISOString(),
        xp: 100, // rewarded initial setup XP!
        streak: 1,
      };
      
      await login(newUser, 'studybuddy-hackathon-token');
      setLoading(false);
    }, 1500);
  };

  return (
    <ScreenContainer scrollable className="bg-white dark:bg-secondary-950 px-6 py-6 flex-1">
      <View className="mt-8 mb-6">
        <Typography variant="h1" className="font-black mb-1">
          Profile Setup
        </Typography>
        <Typography variant="body" color="muted" className="font-semibold text-secondary-500">
          Personalize your learning space to get started.
        </Typography>
      </View>

      <View className="mb-6 items-center">
        <Typography variant="label" className="self-start mb-3">
          Choose Avatar Icon
        </Typography>
        
        <View className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-950/20 justify-center items-center mb-4 border border-primary-200/50">
          <Typography className="text-4xl">{selectedAvatar}</Typography>
        </View>

        <View className="flex-row flex-wrap justify-center gap-3 max-w-xs">
          {AVATAR_PRESETS.map((preset) => (
            <Pressable
              key={preset}
              onPress={() => setSelectedAvatar(preset)}
              className={`w-10 h-10 rounded-full justify-center items-center border active:scale-95 ${
                selectedAvatar === preset ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' : 'border-secondary-200 dark:border-secondary-800'
              }`}
            >
              <Typography className="text-xl">{preset}</Typography>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mb-6">
        <Input
          label="Your Nickname"
          placeholder="e.g. Diganth"
          value={nickname}
          onChangeText={setNickname}
          error={error && !nickname ? error : ''}
          leftIcon={<Icon name="User" size={18} color="#64748b" />}
        />
      </View>

      <View className="mb-6">
        <Typography variant="label" className="mb-3">
          Choose Your Study Topics
        </Typography>
        <View className="flex-row flex-wrap gap-2">
          {SUBJECT_PRESETS.map((subject) => {
            const isSelected = selectedSubjects.includes(subject);
            return (
              <Pressable key={subject} onPress={() => toggleSubject(subject)} className="active:scale-95">
                <Badge
                  label={subject}
                  variant={isSelected ? 'primary' : 'neutral'}
                  type={isSelected ? 'solid' : 'subtle'}
                  className="py-1.5 px-3 rounded-xl border border-secondary-200/10"
                />
              </Pressable>
            );
          })}
        </View>
        {error && selectedSubjects.length === 0 ? (
          <Typography variant="bodySm" color="danger" className="mt-2 font-semibold">
            {error}
          </Typography>
        ) : null}
      </View>

      <View className="mb-8">
        <Typography variant="label" className="mb-3">
          Daily Study Goal
        </Typography>
        
        <View className="flex-row flex-wrap justify-between gap-2.5">
          {GOAL_PRESETS.map((preset) => {
            const isSelected = selectedGoal === preset.minutes;
            return (
              <Pressable
                key={preset.minutes}
                onPress={() => setSelectedGoal(preset.minutes)}
                className="flex-1 min-w-[75px] active:scale-95"
              >
                <Card
                  variant={isSelected ? 'default' : 'flat'}
                  className={`py-3 px-1 items-center border rounded-xl ${
                    isSelected ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20' : 'border-transparent bg-secondary-50/80 dark:bg-secondary-900/50'
                  }`}
                >
                  <Typography variant="h3" className="font-black text-primary-500 mb-0.5">
                    {preset.minutes}m
                  </Typography>
                  <Typography variant="bodySm" color="muted" className="font-bold text-secondary-500">
                    {preset.label}
                  </Typography>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Button
        title="Complete Profile"
        onPress={handleFinish}
        isLoading={loading}
        className="w-full shadow-lg shadow-primary-500/10 mb-6"
      />
    </ScreenContainer>
  );
}

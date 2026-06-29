import React, { useState, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ScreenContainer, Typography, Icon, Button, Card, ProgressRing } from '@/components/ui';
import { useAuthStore } from '@/store/useAuthStore';

export default function FocusSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskTitle = (params.title as string) || 'General Focus Block';

  const updateUserXP = useAuthStore((state) => state.updateUserXP);

  const FOCUS_DURATION = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);

  const breathScale = useSharedValue(1);
  const breathOpacity = useSharedValue(0.25);

  useEffect(() => {
    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 4000 }),
        withTiming(1, { duration: 4000 })
      ),
      -1,
      true
    );
    breathOpacity.value = withRepeat(
      withSequence(
        withTiming(0.55, { duration: 4000 }),
        withTiming(0.25, { duration: 4000 })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setCompleted(true);
      updateUserXP(20);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleQuit = () => {
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const breathAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
    opacity: breathOpacity.value,
  }));

  const progress = timeLeft / FOCUS_DURATION;

  if (completed) {
    return (
      <ScreenContainer safeArea={false} className="bg-secondary-950 flex-1 justify-center items-center px-6">
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-primary-900/50 justify-center items-center mb-6 border border-primary-500/20">
            <Icon name="Award" size={40} color="#8b5cf6" animate="float" />
          </View>

          <Typography variant="h1" className="text-white font-black text-center mb-2">
            Focus Session Finished! 🏆
          </Typography>
          <Typography variant="body" className="text-secondary-400 text-center font-semibold">
            You completed 25 minutes of deep learning for "{taskTitle}".
          </Typography>
        </View>

        <Card variant="glass" className="w-full p-5 border border-primary-500/10 mb-8 bg-secondary-900/50">
          <View className="flex-row justify-between items-center">
            <Typography variant="body" className="text-secondary-400 font-bold">XP Awarded</Typography>
            <Typography variant="h3" className="font-black text-primary-400">+20 XP</Typography>
          </View>
        </Card>

        <Button
          title="Return to Planner"
          onPress={handleQuit}
          className="w-full shadow-lg shadow-primary-500/10"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer safeArea={false} className="bg-secondary-950 flex-1 justify-between px-6 py-12">
      <View className="items-center mt-6">
        <Typography variant="bodySm" className="text-primary-400 font-extrabold uppercase tracking-widest">
          FOCUSING ON
        </Typography>
        <Typography variant="h2" className="text-white font-black mt-1 text-center px-6">
          {taskTitle}
        </Typography>
      </View>

      <View className="items-center justify-center relative my-8 h-80">
        {isActive && (
          <Animated.View
            style={[{ width: 220, height: 220, borderRadius: 110, position: 'absolute' }, breathAnimatedStyle]}
            className="bg-primary-500/10 border border-primary-500/10"
          />
        )}

        <View className="w-60 h-60 rounded-full bg-secondary-900 border border-secondary-800 justify-center items-center shadow-lg">
          <ProgressRing progress={progress} size={210} strokeWidth={9} />
          
          <View className="absolute justify-center items-center">
            <Typography className="text-white text-5xl font-black tracking-tighter">
              {formatTime(timeLeft)}
            </Typography>
            <Typography variant="caption" className="text-secondary-400 font-bold mt-2 tracking-wide uppercase">
              {isActive ? 'Inhale • Exhale' : 'Timer Paused'}
            </Typography>
          </View>
        </View>
      </View>

      <View className="gap-4 w-full mb-6">
        <Button
          title={isActive ? 'Pause Session' : 'Resume Session'}
          onPress={toggleTimer}
          variant={isActive ? 'outline' : 'primary'}
          className={isActive ? 'border-secondary-700 text-white' : ''}
          leftIcon={<Icon name={isActive ? 'Pause' : 'Play'} size={18} color="#ffffff" />}
        />

        <Button
          title="Quit Focus Session"
          onPress={handleQuit}
          variant="text"
          className="text-secondary-400 font-extrabold"
        />
      </View>
    </ScreenContainer>
  );
}

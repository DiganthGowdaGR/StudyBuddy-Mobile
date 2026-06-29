import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScreenContainer, Typography, Icon, Button, IconName } from '@/components/ui';

interface Slide {
  icon: IconName;
  title: string;
  description: string;
  glowColor: string;
}

const slides: Slide[] = [
  {
    icon: 'BookOpen',
    title: 'AI Flashcard Decks',
    description: 'Transform books, documents, or raw notes into custom, spaced-repetition study decks instantly.',
    glowColor: 'bg-primary-500/10',
  },
  {
    icon: 'Clock',
    title: 'Deep Focus Sessions',
    description: 'Gamify your study schedule using pomodoro tracking, earn XP rewards, and preserve daily streaks.',
    glowColor: 'bg-accent-500/10',
  },
  {
    icon: 'Sparkles',
    title: 'AI Coach Explanations',
    description: 'Stuck on a tricky homework question? Chat with your tutor for detailed breakdowns and quick quiz test preps.',
    glowColor: 'bg-primary-500/10',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const slideOpacity = useSharedValue(1);

  const handleNext = () => {
    if (currentIdx === slides.length - 1) {
      router.push('/(auth)/login');
    } else {
      slideOpacity.value = withTiming(0, { duration: 150 }, () => {
        runOnJS(setCurrentIdx)(currentIdx + 1);
        slideOpacity.value = withTiming(1, { duration: 250 });
      });
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/login');
  };

  const currentSlide = slides[currentIdx];

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: slideOpacity.value,
  }));

  return (
    <ScreenContainer className="bg-white dark:bg-secondary-950 justify-between py-8 flex-1">
      <View className="flex-row items-center justify-between w-full px-2">
        <Typography variant="h3" className="font-extrabold text-primary-500">
          Study<Typography className="text-secondary-900 dark:text-secondary-100 font-extrabold">Buddy</Typography>
        </Typography>

        {currentIdx < slides.length - 1 && (
          <Pressable onPress={handleSkip} className="active:opacity-50">
            <Typography variant="body" color="muted" className="font-bold">
              Skip
            </Typography>
          </Pressable>
        )}
      </View>

      <Animated.View style={[fadeStyle, { flex: 1, justifyContent: 'center' }]} className="items-center px-4 my-8">
        <View className={`w-36 h-36 rounded-full justify-center items-center mb-8 ${currentSlide.glowColor}`}>
          <Icon name={currentSlide.icon} size={54} color="#8b5cf6" animate="float" />
        </View>

        <Typography variant="h2" align="center" className="font-black mb-3">
          {currentSlide.title}
        </Typography>

        <Typography variant="body" align="center" color="secondary" className="font-medium px-4 leading-relaxed">
          {currentSlide.description}
        </Typography>
      </Animated.View>

      <View className="w-full px-2">
        <View className="flex-row justify-center gap-2 mb-6">
          {slides.map((_, idx) => (
            <View
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIdx ? 'w-5 bg-primary-500' : 'w-1.5 bg-secondary-200 dark:bg-secondary-800'
              }`}
            />
          ))}
        </View>

        <Button
          title={currentIdx === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          className="w-full shadow-lg shadow-primary-500/10"
        />
      </View>
    </ScreenContainer>
  );
}

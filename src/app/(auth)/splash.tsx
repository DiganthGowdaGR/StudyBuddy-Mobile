import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ScreenContainer, Typography, Icon } from '@/components/ui';

export default function SplashScreen() {
  const router = useRouter();
  const pulse = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200, easing: Easing.ease }),
        withTiming(1, { duration: 1200, easing: Easing.ease })
      ),
      -1,
      true
    );

    opacity.value = withTiming(1, { duration: 1000 });

    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const fadeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <ScreenContainer safeArea={false} className="bg-secondary-950 justify-center items-center flex-1">
      <View className="items-center justify-center">
        <Animated.View
          style={logoAnimatedStyle}
          className="w-28 h-28 rounded-[32px] bg-primary-500 justify-center items-center shadow-2xl mb-6 border border-primary-400/20"
        >
          <Icon name="Brain" size={52} color="#ffffff" />
        </Animated.View>

        <Animated.View style={fadeAnimatedStyle} className="items-center">
          <Typography variant="h1" className="text-white font-black tracking-wider text-center">
            Study<Typography className="text-primary-400 font-black">Buddy</Typography>
          </Typography>
          
          <Typography variant="body" className="text-secondary-400 font-medium text-center mt-2 max-w-[240px]">
            Your AI-Powered Learning Companion
          </Typography>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

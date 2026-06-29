import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/utils/cn';

export interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  overlay?: boolean;
  className?: string;
}

export function Loader({
  size = 'medium',
  label,
  overlay = false,
  className,
}: LoaderProps) {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(0.8);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    pulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800, easing: Easing.ease }),
        withTiming(0.8, { duration: 800, easing: Easing.ease })
      ),
      -1,
      true
    );
  }, []);

  const sizeDimensions = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-[3px]',
    large: 'w-16 h-16 border-4',
  };

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: pulse.value,
  }));

  const loaderContent = (
    <View className="items-center justify-center">
      {/* Pulsing ring background */}
      <Animated.View
        style={pulseStyle}
        className={cn(
          'absolute bg-primary-500/10 rounded-full',
          size === 'small' ? 'w-10 h-10' : size === 'medium' ? 'w-16 h-16' : 'w-24 h-24'
        )}
      />

      {/* Rotating ring spinner */}
      <Animated.View
        style={spinnerStyle}
        className={cn(
          'border-primary-500 border-t-transparent rounded-full',
          sizeDimensions[size]
        )}
      />

      {label && (
        <Text className="mt-4 text-sm font-semibold text-secondary-700 dark:text-secondary-300">
          {label}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <View className={cn('absolute inset-0 bg-secondary-950/40 backdrop-blur-sm justify-center items-center z-50', className)}>
        {loaderContent}
      </View>
    );
  }

  return <View className={cn('justify-center items-center', className)}>{loaderContent}</View>;
}

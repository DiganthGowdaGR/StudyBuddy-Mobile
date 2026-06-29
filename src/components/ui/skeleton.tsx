import React, { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/utils/cn';

export interface SkeletonProps extends ViewProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'rounded';
}

export function Skeleton({ className, variant = 'rounded', ...props }: SkeletonProps) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 800, easing: Easing.ease }),
        withTiming(0.4, { duration: 800, easing: Easing.ease })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const variantClasses = {
    rect: 'rounded-none',
    circle: 'rounded-full',
    rounded: 'rounded-xl',
  };

  const skeletonClasses = cn(
    'bg-secondary-200 dark:bg-secondary-800',
    variantClasses[variant],
    className
  );

  return <Animated.View style={animatedStyle} className={skeletonClasses} {...props} />;
}

// Subcomponents for easy layouts

interface SkeletonLineProps {
  width?: number | string;
  height?: number;
  className?: string;
}

export function SkeletonLine({ width = '100%', height = 14, className }: SkeletonLineProps) {
  return (
    <Skeleton
      style={{ width: width as any, height }}
      className={cn('mb-2.5 last:mb-0', className)}
    />
  );
}

interface SkeletonCircleProps {
  size?: number;
  className?: string;
}

export function SkeletonCircle({ size = 48, className }: SkeletonCircleProps) {
  return (
    <Skeleton
      variant="circle"
      style={{ width: size, height: size }}
      className={className}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <View className={cn('p-5 bg-white dark:bg-secondary-900 border border-secondary-100 dark:border-secondary-800 rounded-2xl mb-4', className)}>
      <View className="flex-row items-center mb-4">
        <SkeletonCircle size={40} className="mr-3" />
        <View className="flex-1">
          <SkeletonLine width="55%" height={14} className="mb-2" />
          <SkeletonLine width="35%" height={10} />
        </View>
      </View>
      <SkeletonLine width="95%" height={12} className="mb-2" />
      <SkeletonLine width="80%" height={12} className="mb-4" />
      <View className="flex-row gap-2">
        <Skeleton style={{ width: 60, height: 24 }} className="rounded-lg" />
        <Skeleton style={{ width: 80, height: 24 }} className="rounded-lg" />
      </View>
    </View>
  );
}

Skeleton.Line = SkeletonLine;
Skeleton.Circle = SkeletonCircle;
Skeleton.Card = SkeletonCard;

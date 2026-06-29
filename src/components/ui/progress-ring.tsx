import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { cn } from '@/utils/cn';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ProgressRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
  className?: string;
  trackColor?: string;
  progressColor?: string;
}

export function ProgressRing({
  progress = 0,
  size = 80,
  strokeWidth = 8,
  showText = true,
  className,
  trackColor = '#e2e8f0', // slate-200
  progressColor = '#8b5cf6', // violet-500
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffsetShared = useSharedValue(circumference);

  useEffect(() => {
    const boundedProgress = Math.max(0, Math.min(1, progress));
    const targetOffset = circumference - boundedProgress * circumference;
    strokeDashoffsetShared.value = withSpring(targetOffset, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress, circumference]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeDashoffsetShared.value,
  }));

  const percentage = Math.round(Math.max(0, Math.min(1, progress)) * 100);

  return (
    <View
      style={{ width: size, height: size }}
      className={cn('justify-center items-center relative', className)}
    >
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="transparent"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {showText && (
        <View className="absolute justify-center items-center">
          <Text className="text-sm font-bold text-secondary-900 dark:text-secondary-100">
            {percentage}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  svg: {
    transform: [{ rotateZ: '0deg' }],
  },
});

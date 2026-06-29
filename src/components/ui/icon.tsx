import React from 'react';
import * as Icons from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/utils/cn';

export type IconName = keyof typeof Icons;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  animate?: 'none' | 'spin' | 'pulse' | 'float';
}

export function Icon({
  name,
  size = 20,
  color = '#64748b', // Default secondary color slate-500
  className,
  animate = 'none',
}: IconProps) {
  const IconComponent = Icons[name] as React.ComponentType<any>;

  if (!IconComponent) {
    console.warn(`Icon name "${name}" not found in lucide-react-native.`);
    return null;
  }

  const spinVal = useSharedValue(0);
  const pulseVal = useSharedValue(1);
  const floatVal = useSharedValue(0);

  React.useEffect(() => {
    if (animate === 'spin') {
      spinVal.value = 0;
      spinVal.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    } else if (animate === 'pulse') {
      pulseVal.value = 1;
      pulseVal.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1000, easing: Easing.ease }),
          withTiming(0.85, { duration: 1000, easing: Easing.ease })
        ),
        -1,
        true
      );
    } else if (animate === 'float') {
      floatVal.value = 0;
      floatVal.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(5, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => {
    if (animate === 'spin') {
      return { transform: [{ rotate: `${spinVal.value}deg` }] };
    }
    if (animate === 'pulse') {
      return { transform: [{ scale: pulseVal.value }] };
    }
    if (animate === 'float') {
      return { transform: [{ translateY: floatVal.value }] };
    }
    return {};
  });

  return (
    <Animated.View style={animatedStyle} className={cn('justify-center items-center', className)}>
      <IconComponent size={size} color={color} />
    </Animated.View>
  );
}

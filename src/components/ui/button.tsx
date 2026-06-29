import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { cn } from '@/utils/cn';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ButtonProps {
  onPress?: () => void;
  children?: React.ReactNode;
  title?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

export function Button({
  onPress,
  children,
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  textClassName,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (disabled || isLoading) return;
    scale.value = 0.96;
  };

  const handlePressOut = () => {
    scale.value = 1;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 200 }) }],
  }));

  const variantStyles = {
    primary: 'bg-primary-500 active:bg-primary-600 border border-transparent',
    secondary: 'bg-secondary-100 dark:bg-secondary-800 border border-transparent active:bg-secondary-200 dark:active:bg-secondary-700',
    outline: 'bg-transparent border border-secondary-300 dark:border-secondary-700 active:bg-secondary-50 dark:active:bg-secondary-900',
    text: 'bg-transparent border border-transparent active:bg-secondary-50 dark:active:bg-secondary-900',
    ghost: 'bg-transparent border border-transparent opacity-80 active:opacity-100',
    danger: 'bg-danger-500 active:bg-danger-600 border border-transparent',
  };

  const sizeStyles = {
    sm: 'py-2 px-3 rounded-lg gap-1.5',
    md: 'py-3.5 px-5 rounded-xl gap-2',
    lg: 'py-4 px-6 rounded-2xl gap-2.5',
  };

  const textStyles = {
    primary: 'text-white font-semibold',
    secondary: 'text-secondary-900 dark:text-secondary-100 font-semibold',
    outline: 'text-secondary-800 dark:text-secondary-200 font-semibold',
    text: 'text-primary-500 dark:text-primary-400 font-semibold',
    ghost: 'text-secondary-700 dark:text-secondary-300 font-medium',
    danger: 'text-white font-semibold',
  };

  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const buttonClasses = cn(
    'flex-row items-center justify-center',
    variantStyles[variant],
    sizeStyles[size],
    (disabled || isLoading) && 'opacity-50',
    className
  );

  const buttonTextClasses = cn(
    textStyles[variant],
    textSizeStyles[size],
    textClassName
  );

  return (
    <AnimatedPressable
      style={[animatedStyle]}
      onPress={disabled || isLoading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      className={buttonClasses}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#ffffff' : '#8b5cf6'}
        />
      ) : (
        <>
          {leftIcon && <View className="justify-center items-center">{leftIcon}</View>}
          {title ? (
            <Text className={buttonTextClasses}>{title}</Text>
          ) : (
            children
          )}
          {rightIcon && <View className="justify-center items-center">{rightIcon}</View>}
        </>
      )}
    </AnimatedPressable>
  );
}

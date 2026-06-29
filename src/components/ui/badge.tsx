import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '@/utils/cn';

export interface BadgeProps {
  label?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  type?: 'solid' | 'outline' | 'subtle';
  leftIcon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

export function Badge({
  label,
  children,
  variant = 'primary',
  type = 'subtle',
  leftIcon,
  className,
  textClassName,
}: BadgeProps) {
  const variantStyles = {
    primary: {
      solid: 'bg-primary-500 border-transparent',
      outline: 'bg-transparent border-primary-500',
      subtle: 'bg-primary-100 dark:bg-primary-950/30 border-transparent',
    },
    secondary: {
      solid: 'bg-secondary-500 border-transparent',
      outline: 'bg-transparent border-secondary-500',
      subtle: 'bg-secondary-100 dark:bg-secondary-800 border-transparent',
    },
    success: {
      solid: 'bg-success-500 border-transparent',
      outline: 'bg-transparent border-success-500',
      subtle: 'bg-success-50 dark:bg-success-950/20 border-transparent',
    },
    warning: {
      solid: 'bg-warning-500 border-transparent',
      outline: 'bg-transparent border-warning-500',
      subtle: 'bg-warning-50 dark:bg-warning-950/20 border-transparent',
    },
    danger: {
      solid: 'bg-danger-500 border-transparent',
      outline: 'bg-transparent border-danger-500',
      subtle: 'bg-danger-50 dark:bg-danger-950/20 border-transparent',
    },
    info: {
      solid: 'bg-info-500 border-transparent',
      outline: 'bg-transparent border-info-500',
      subtle: 'bg-info-50 dark:bg-info-950/20 border-transparent',
    },
    neutral: {
      solid: 'bg-secondary-700 dark:bg-secondary-300 border-transparent',
      outline: 'bg-transparent border-secondary-300 dark:border-secondary-700',
      subtle: 'bg-secondary-100 dark:bg-secondary-800 border-transparent',
    },
  };

  const textStyles = {
    primary: {
      solid: 'text-white',
      outline: 'text-primary-500',
      subtle: 'text-primary-700 dark:text-primary-300',
    },
    secondary: {
      solid: 'text-white',
      outline: 'text-secondary-500',
      subtle: 'text-secondary-700 dark:text-secondary-300',
    },
    success: {
      solid: 'text-white',
      outline: 'text-success-600 dark:text-success-400',
      subtle: 'text-success-700 dark:text-success-400',
    },
    warning: {
      solid: 'text-white',
      outline: 'text-warning-600 dark:text-warning-400',
      subtle: 'text-warning-700 dark:text-warning-400',
    },
    danger: {
      solid: 'text-white',
      outline: 'text-danger-600 dark:text-danger-400',
      subtle: 'text-danger-700 dark:text-danger-400',
    },
    info: {
      solid: 'text-white',
      outline: 'text-info-600 dark:text-info-400',
      subtle: 'text-info-700 dark:text-info-400',
    },
    neutral: {
      solid: 'text-white dark:text-secondary-900',
      outline: 'text-secondary-700 dark:text-secondary-300',
      subtle: 'text-secondary-700 dark:text-secondary-300',
    },
  };

  const badgeClasses = cn(
    'flex-row items-center self-start px-2.5 py-0.5 rounded-full border',
    variantStyles[variant][type],
    className
  );

  const badgeTextClasses = cn(
    'text-xs font-semibold tracking-wide',
    textStyles[variant][type],
    textClassName
  );

  return (
    <View className={badgeClasses}>
      {leftIcon && <View className="mr-1 justify-center items-center">{leftIcon}</View>}
      {label ? <Text className={badgeTextClasses}>{label}</Text> : children}
    </View>
  );
}

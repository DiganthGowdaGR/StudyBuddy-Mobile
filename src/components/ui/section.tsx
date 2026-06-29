import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { cn } from '@/utils/cn';

export interface SectionProps {
  title: string;
  children: React.ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
  className?: string;
  contentClassName?: string;
}

export function Section({
  title,
  children,
  actionLabel,
  onActionPress,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <View className={cn('mb-6', className)}>
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="text-base font-bold text-secondary-900 dark:text-secondary-100">
          {title}
        </Text>
        {actionLabel && onActionPress && (
          <Pressable onPress={onActionPress} className="active:opacity-60">
            <Text className="text-sm font-semibold text-primary-500 dark:text-primary-400">
              {actionLabel}
            </Text>
          </Pressable>
        )}
      </View>
      <View className={cn('w-full', contentClassName)}>{children}</View>
    </View>
  );
}

import React from 'react';
import { Image, Text, View } from 'react-native';
import { cn } from '@/utils/cn';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  border?: boolean;
  className?: string;
}

export function Avatar({
  src,
  name,
  size = 'md',
  status,
  border = false,
  className,
}: AvatarProps) {
  const getInitials = (fullName?: string) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-full',
    md: 'w-12 h-12 rounded-full',
    lg: 'w-16 h-16 rounded-full',
    xl: 'w-24 h-24 rounded-full',
  };

  const textSizes = {
    sm: 'text-xs font-bold',
    md: 'text-sm font-bold',
    lg: 'text-lg font-bold',
    xl: 'text-2xl font-bold',
  };

  const statusSizeClasses = {
    sm: 'w-2.5 h-2.5 right-0 bottom-0 border-2',
    md: 'w-3.5 h-3.5 right-0.5 bottom-0.5 border-[2px]',
    lg: 'w-4.5 h-4.5 right-0.5 bottom-0.5 border-[3px]',
    xl: 'w-5.5 h-5.5 right-1 bottom-1 border-[4px]',
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-secondary-400 dark:bg-secondary-600',
    busy: 'bg-danger-500',
    away: 'bg-warning-500',
  };

  const initials = getInitials(name);

  return (
    <View className="relative">
      <View
        className={cn(
          'justify-center items-center overflow-hidden bg-primary-100 dark:bg-primary-950/40 border border-secondary-200/10',
          sizeClasses[size],
          border && 'border-2 border-primary-500',
          className
        )}
      >
        {src ? (
          <Image
            source={{ uri: src }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Text className={cn('text-primary-600 dark:text-primary-300', textSizes[size])}>
            {initials}
          </Text>
        )}
      </View>

      {status && (
        <View
          className={cn(
            'absolute rounded-full border-white dark:border-secondary-950',
            statusSizeClasses[size],
            statusColors[status]
          )}
        />
      )}
    </View>
  );
}

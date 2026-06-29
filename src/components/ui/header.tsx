import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/utils/cn';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackButtonPress?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function Header({
  title,
  subtitle,
  showBackButton = false,
  onBackButtonPress,
  rightAction,
  className,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackButtonPress) {
      onBackButtonPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View
      style={{ paddingTop: Math.max(insets.top, 16) }}
      className={cn(
        'px-5 pb-4 bg-white dark:bg-secondary-950 border-b border-secondary-100 dark:border-secondary-900 flex-row items-center justify-between',
        className
      )}
    >
      <View className="flex-row items-center flex-1 mr-4">
        {showBackButton && (
          <Pressable
            onPress={handleBack}
            className="mr-3 p-2 -ml-2 rounded-full active:bg-secondary-100 dark:active:bg-secondary-900 justify-center items-center"
          >
            <ArrowLeft size={22} className="text-secondary-900 dark:text-secondary-100" />
          </Pressable>
        )}

        <View className="flex-1">
          <Text numberOfLines={1} className="text-lg font-bold text-secondary-900 dark:text-secondary-100">
            {title}
          </Text>
          {subtitle && (
            <Text numberOfLines={1} className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightAction && <View className="flex-row items-center">{rightAction}</View>}
    </View>
  );
}

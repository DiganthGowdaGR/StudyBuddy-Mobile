import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { BookOpen, Clock, Home, Sparkles, User } from 'lucide-react-native';
import { cn } from '@/utils/cn';

export interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
}

export function BottomNavigation({
  activeTab = 'home',
  onTabChange,
  className,
}: BottomNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'study', label: 'Study', icon: Clock },
    { id: 'decks', label: 'Decks', icon: BookOpen },
    { id: 'ai', label: 'AI Coach', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <View
      className={cn(
        'w-full px-4 pb-5 pt-3 bg-white/90 dark:bg-secondary-900/90 border-t border-secondary-100 dark:border-secondary-800 backdrop-blur-md',
        Platform.OS === 'ios' && 'pb-8',
        className
      )}
    >
      <View className="flex-row items-center justify-around w-full max-w-lg mx-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange?.(tab.id)}
              className="items-center justify-center py-1.5 px-3 rounded-2xl active:opacity-60"
            >
              <View
                className={cn(
                  'p-2 rounded-xl mb-1 items-center justify-center',
                  isActive ? 'bg-primary-500/10 dark:bg-primary-500/20' : 'bg-transparent'
                )}
              >
                <IconComponent
                  size={20}
                  color={isActive ? '#8b5cf6' : '#64748b'}
                />
              </View>
              <Text
                className={cn(
                  'text-[10px] font-medium tracking-wide',
                  isActive ? 'text-primary-500 dark:text-primary-400 font-bold' : 'text-secondary-500 dark:text-secondary-400'
                )}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

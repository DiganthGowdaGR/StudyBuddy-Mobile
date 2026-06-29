import React, { useEffect } from 'react';
import { Dimensions, Platform, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
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

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  const translateX = useSharedValue(0);

  const screenWidth = Dimensions.get('window').width;
  const containerWidth = Math.min(screenWidth - 32, 480); // padding constraints and max size limit
  const tabWidth = containerWidth / tabs.length;

  useEffect(() => {
    translateX.value = withSpring(activeIndex * tabWidth, {
      damping: 18,
      stiffness: 120,
    });
  }, [activeIndex, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: tabWidth,
  }));

  return (
    <View
      className={cn(
        'w-full px-4 pb-5 pt-3 bg-white/90 dark:bg-secondary-900/90 border-t border-secondary-100 dark:border-secondary-800 backdrop-blur-md',
        Platform.OS === 'ios' && 'pb-8',
        className
      )}
    >
      <View
        style={{ width: containerWidth }}
        className="relative flex-row items-center w-full mx-auto justify-start"
      >
        {/* Animated active tab background track indicator */}
        <Animated.View
          style={[indicatorStyle, { height: 40, top: 2 }]}
          className="absolute items-center justify-center z-0"
        >
          <View className="w-10 h-10 rounded-2xl bg-primary-500/10 dark:bg-primary-500/20" />
        </Animated.View>

        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange?.(tab.id)}
              style={{ width: tabWidth }}
              className="items-center justify-center py-1 rounded-2xl active:opacity-80 z-10"
            >
              <View className="h-10 w-10 items-center justify-center rounded-2xl">
                <IconComponent
                  size={20}
                  color={isActive ? '#8b5cf6' : '#64748b'}
                />
              </View>
              <Text
                className={cn(
                  'text-[9px] font-medium tracking-wide mt-0.5',
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

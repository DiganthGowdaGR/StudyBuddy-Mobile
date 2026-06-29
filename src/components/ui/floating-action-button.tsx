import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Icon, IconName } from './icon';
import { cn } from '@/utils/cn';

export interface FABAction {
  icon: IconName;
  label: string;
  onPress: () => void;
}

export interface FloatingActionButtonProps {
  icon?: IconName;
  onPress?: () => void;
  actions?: FABAction[];
  className?: string;
}

export function FloatingActionButton({
  icon = 'Plus',
  onPress,
  actions = [],
  className,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useSharedValue(0);

  const toggleMenu = () => {
    if (actions.length === 0) {
      onPress?.();
      return;
    }
    const target = isOpen ? 0 : 1;
    animation.value = withSpring(target, { damping: 15, stiffness: 150 });
    setIsOpen(!isOpen);
  };

  const handleActionPress = (actionFn: () => void) => {
    toggleMenu();
    setTimeout(actionFn, 150);
  };

  const mainBtnStyle = useAnimatedStyle(() => {
    const rotation = animation.value * 45; // Rotates 45deg to morph Plus into Close
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value * 0.4,
      pointerEvents: isOpen ? 'auto' : 'none',
    };
  });

  return (
    <>
      {isOpen && (
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
          onTouchStart={toggleMenu}
        />
      )}

      <View className={cn('absolute right-5 bottom-24 items-end z-40', className)}>
        {actions.length > 0 && (
          <View className="mb-4 gap-3 items-end">
            {actions.map((action, idx) => {
              const actionItemStyle = useAnimatedStyle(() => {
                const scale = animation.value;
                const translateY = (1 - animation.value) * 15 * (idx + 1);
                return {
                  opacity: scale,
                  transform: [{ scale }, { translateY }],
                };
              });

              return (
                <Animated.View
                  key={action.label}
                  style={[actionItemStyle]}
                  className="flex-row items-center"
                >
                  <View className="bg-white dark:bg-secondary-900 px-3 py-1.5 rounded-lg mr-3 border border-secondary-100 dark:border-secondary-800 shadow-sm">
                    <Text className="text-xs font-semibold text-secondary-800 dark:text-secondary-200">
                      {action.label}
                    </Text>
                  </View>
                  
                  <Pressable
                    onPress={() => handleActionPress(action.onPress)}
                    className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-800 justify-center items-center shadow-sm border border-secondary-200/10 active:bg-secondary-200 dark:active:bg-secondary-700"
                  >
                    <Icon name={action.icon} size={18} color="#8b5cf6" />
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        )}

        <Pressable
          onPress={toggleMenu}
          className="w-14 h-14 rounded-full bg-primary-500 justify-center items-center shadow-lg active:bg-primary-600 border border-primary-400/20"
        >
          <Animated.View style={mainBtnStyle}>
            <Icon name={isOpen && actions.length > 0 ? 'Plus' : icon} size={24} color="#ffffff" />
          </Animated.View>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: '#000000',
    zIndex: 30,
  },
});

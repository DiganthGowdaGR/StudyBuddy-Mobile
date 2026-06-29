import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GlassView } from 'expo-glass-effect';
import { cn } from '@/utils/cn';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface CardProps {
  children?: React.ReactNode;
  onPress?: () => void;
  header?: React.ReactNode | string;
  footer?: React.ReactNode | string;
  variant?: 'default' | 'outlined' | 'glass' | 'flat';
  className?: string;
  contentClassName?: string;
}

export function Card({
  children,
  onPress,
  header,
  footer,
  variant = 'default',
  className,
  contentClassName,
}: CardProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (!onPress) return;
    scale.value = 0.98;
  };

  const handlePressOut = () => {
    scale.value = 1;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 200 }) }],
  }));

  const variantStyles = {
    default: 'bg-white dark:bg-secondary-900 border border-secondary-100 dark:border-secondary-800 shadow-sm',
    outlined: 'bg-transparent border border-secondary-200 dark:border-secondary-800',
    glass: 'bg-white/40 dark:bg-secondary-900/40 border border-white/20 dark:border-white/10 shadow-sm overflow-hidden',
    flat: 'bg-secondary-50 dark:bg-secondary-900/50 border border-transparent',
  };

  const cardClasses = cn(
    'rounded-2xl overflow-hidden',
    variantStyles[variant],
    className
  );

  const ContainerComponent = onPress ? AnimatedPressable : View;
  const containerStyleProps = onPress ? [animatedStyle] : [];

  const renderCardContent = () => (
    <>
      {header && (
        <View className="px-5 py-4 border-b border-secondary-100 dark:border-secondary-800">
          {typeof header === 'string' ? (
            <Text className="text-base font-semibold text-secondary-900 dark:text-secondary-100">
              {header}
            </Text>
          ) : (
            header
          )}
        </View>
      )}

      <View className={cn('p-5', contentClassName)}>
        {children}
      </View>

      {footer && (
        <View className="px-5 py-3.5 bg-secondary-50/50 dark:bg-secondary-900/30 border-t border-secondary-100 dark:border-secondary-800">
          {typeof footer === 'string' ? (
            <Text className="text-xs text-secondary-500 dark:text-secondary-400">
              {footer}
            </Text>
          ) : (
            footer
          )}
        </View>
      )}
    </>
  );

  if (variant === 'glass') {
    return (
      <ContainerComponent
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={containerStyleProps as any}
        className={cardClasses}
      >
        <GlassView style={styles.glassContainer} glassEffectStyle="regular">
          {renderCardContent()}
        </GlassView>
      </ContainerComponent>
    );
  }

  return (
    <ContainerComponent
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={containerStyleProps as any}
      className={cardClasses}
    >
      {renderCardContent()}
    </ContainerComponent>
  );
}

const styles = {
  glassContainer: {
    width: '100%' as const,
    height: 'auto' as const,
  },
};


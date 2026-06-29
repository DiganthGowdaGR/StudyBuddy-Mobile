import React from 'react';
import { Text, View } from 'react-native';
import { Icon, IconName } from './icon';
import { Button } from './button';
import { cn } from '@/utils/cn';

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
}

export interface EmptyStateProps {
  icon?: IconName | React.ReactNode;
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

export function EmptyState({
  icon = 'BookOpen',
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn('justify-center items-center py-12 px-6 max-w-sm mx-auto text-center', className)}>
      <View className="mb-5 p-4.5 rounded-full bg-primary-50 dark:bg-primary-950/20 justify-center items-center border border-primary-100/20">
        {typeof icon === 'string' ? (
          <Icon name={icon as IconName} size={36} color="#8b5cf6" animate="float" />
        ) : (
          icon
        )}
      </View>

      <Text className="text-base font-bold text-secondary-900 dark:text-secondary-100 mb-2">
        {title}
      </Text>
      
      <Text className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed mb-6">
        {description}
      </Text>

      {(action || secondaryAction) && (
        <View className="w-full gap-2">
          {action && (
            <Button
              title={action.label}
              onPress={action.onPress}
              isLoading={action.isLoading}
              className="w-full"
            />
          )}
          {secondaryAction && (
            <Button
              title={secondaryAction.label}
              onPress={secondaryAction.onPress}
              variant="outline"
              isLoading={secondaryAction.isLoading}
              className="w-full"
            />
          )}
        </View>
      )}
    </View>
  );
}

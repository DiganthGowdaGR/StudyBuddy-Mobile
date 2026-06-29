import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Loader } from './loader';
import { cn } from '@/utils/cn';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  safeArea?: boolean;
  keyboardAvoiding?: boolean;
  isLoading?: boolean;
  className?: string;
  contentContainerClassName?: string;
}

export function ScreenContainer({
  children,
  scrollable = false,
  safeArea = true,
  keyboardAvoiding = true,
  isLoading = false,
  className,
  contentContainerClassName,
}: ScreenContainerProps) {
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const containerClasses = cn(
    'flex-1 bg-secondary-50 dark:bg-secondary-950',
    className
  );

  const innerContent = scrollable ? (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: Math.max(insets.bottom, 16),
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className={cn('p-5 flex-1', contentContainerClassName)}>
        {children}
      </View>
    </ScrollView>
  ) : (
    <View className={cn('p-5 flex-1', contentContainerClassName)}>
      {children}
    </View>
  );

  const wrapper = safeArea ? (
    <SafeAreaView className={containerClasses}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {innerContent}
        </KeyboardAvoidingView>
      ) : (
        innerContent
      )}
    </SafeAreaView>
  ) : (
    <View className={containerClasses}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {innerContent}
        </KeyboardAvoidingView>
      ) : (
        innerContent
      )}
    </View>
  );

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {wrapper}
      {isLoading && (
        <View className="absolute inset-0 bg-secondary-950/40 backdrop-blur-sm justify-center items-center z-50">
          <Loader size="large" />
        </View>
      )}
    </>
  );
}

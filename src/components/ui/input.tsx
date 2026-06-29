import React, { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { cn } from '@/utils/cn';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  secureTextEntry,
  containerClassName,
  labelClassName,
  inputClassName,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const isPassword = secureTextEntry;
  const shouldSecureText = isPassword && !isPasswordVisible;

  return (
    <View className={cn('w-full mb-4', containerClassName)}>
      {label && (
        <Text className={cn('text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5', labelClassName)}>
          {label}
        </Text>
      )}

      <View
        className={cn(
          'flex-row items-center w-full bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl px-4 py-3.5',
          isFocused && 'border-primary-500 ring-2 ring-primary-500/20',
          error && 'border-danger-500 ring-2 ring-danger-500/20'
        )}
      >
        {leftIcon && <View className="mr-2.5 justify-center items-center">{leftIcon}</View>}

        <TextInput
          className={cn(
            'flex-1 text-secondary-900 dark:text-secondary-100 text-sm p-0 m-0',
            inputClassName
          )}
          placeholderTextColor="#94a3b8"
          secureTextEntry={shouldSecureText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {isPassword ? (
          <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)} className="ml-2.5 p-0.5 justify-center items-center">
            {isPasswordVisible ? (
              <EyeOff size={18} color="#64748b" />
            ) : (
              <Eye size={18} color="#64748b" />
            )}
          </Pressable>
        ) : (
          rightIcon && <View className="ml-2.5 justify-center items-center">{rightIcon}</View>
        )}
      </View>

      {error ? (
        <Text className="text-xs text-danger-500 font-medium mt-1.5">{error}</Text>
      ) : helperText ? (
        <Text className="text-xs text-secondary-400 dark:text-secondary-500 mt-1.5">{helperText}</Text>
      ) : null}
    </View>
  );
}

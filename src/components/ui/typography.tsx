import React from 'react';
import { Text, TextProps } from 'react-native';
import { cn } from '@/utils/cn';

export interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySm' | 'caption' | 'label';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
}

export function Typography({
  children,
  variant = 'body',
  weight,
  color = 'default',
  align = 'left',
  className,
  ...props
}: TypographyProps) {
  const variantClasses = {
    h1: 'text-3xl font-bold tracking-tight leading-snug',
    h2: 'text-2xl font-bold tracking-tight leading-snug',
    h3: 'text-lg font-semibold tracking-wide leading-snug',
    h4: 'text-base font-semibold leading-snug',
    body: 'text-sm font-normal leading-relaxed',
    bodySm: 'text-xs font-normal leading-relaxed',
    caption: 'text-[10px] font-medium tracking-wider uppercase',
    label: 'text-sm font-semibold tracking-wide',
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black',
  };

  const colorClasses = {
    default: 'text-secondary-900 dark:text-secondary-100',
    muted: 'text-secondary-400 dark:text-secondary-500',
    primary: 'text-primary-500 dark:text-primary-400',
    secondary: 'text-secondary-600 dark:text-secondary-300',
    accent: 'text-accent-500 dark:text-accent-400',
    success: 'text-success-600 dark:text-success-400',
    warning: 'text-warning-600 dark:text-warning-400',
    danger: 'text-danger-600 dark:text-danger-400',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const textClasses = cn(
    variantClasses[variant],
    weight && weightClasses[weight],
    colorClasses[color],
    alignClasses[align],
    className
  );

  return (
    <Text className={textClasses} {...props}>
      {children}
    </Text>
  );
}

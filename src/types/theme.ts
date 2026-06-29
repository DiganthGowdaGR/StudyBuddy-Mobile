import { ColorTheme } from '@/theme/colors';
import { fontSizes, fontWeights, spacing, shadows } from '@/theme';

export interface ThemeConfig {
  colors: ColorTheme;
  spacing: typeof spacing;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
  shadows: typeof shadows;
}

export type ThemeMode = 'light' | 'dark' | 'system';

import { colors } from '@/theme/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'unspecified' || !scheme ? 'light' : (scheme as 'light' | 'dark');

  return colors[theme];
}


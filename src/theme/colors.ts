export const colors = {
  light: {
    primary: '#8b5cf6', // violet-500
    primaryDark: '#7c3aed', // violet-600
    primaryLight: '#c4b5fd', // violet-300
    background: '#f8fafc', // slate-50
    surface: '#ffffff', // white
    surfaceElevated: '#f1f5f9', // slate-100
    backgroundElement: '#f1f5f9', // slate-100 (compatibility alias)
    backgroundSelected: '#cbd5e1', // slate-300 (compatibility alias)
    text: '#0f172a', // slate-900
    textSecondary: '#64748b', // slate-500
    textMuted: '#94a3b8', // slate-400
    border: '#e2e8f0', // slate-200
    accent: '#06b6d4', // cyan-500
    success: '#22c55e', // green-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
    info: '#3b82f6', // blue-500
    card: '#ffffff',
    cardBorder: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.05)',
  },
  dark: {
    primary: '#a78bfa', // violet-400
    primaryDark: '#8b5cf6', // violet-500
    primaryLight: '#ddd6fe', // violet-200
    background: '#020617', // slate-950
    surface: '#0f172a', // slate-900
    surfaceElevated: '#1e293b', // slate-800
    backgroundElement: '#1e293b', // slate-800 (compatibility alias)
    backgroundSelected: '#334155', // slate-700 (compatibility alias)
    text: '#f8fafc', // slate-50
    textSecondary: '#94a3b8', // slate-400
    textMuted: '#64748b', // slate-500
    border: '#1e293b', // slate-800
    accent: '#22d3ee', // cyan-400
    success: '#4ade80', // green-400
    warning: '#fbbf24', // amber-400
    danger: '#f87171', // red-400
    info: '#60a5fa', // blue-400
    card: '#0f172a',
    cardBorder: '#1e293b',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

export type ColorTheme = typeof colors.light;
export type ColorKeys = keyof ColorTheme;
export type ColorPalette = typeof colors;

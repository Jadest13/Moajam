export const theme = {
  colors: {
    background: '#f4f7fc',
    surface: '#ffffff',
    surfaceRaised: '#eef3fb',
    border: '#e5eaf2',
    text: '#111d38',
    textMuted: '#7b879f',
    primary: '#2563eb',
    primaryInk: '#ffffff',
    success: '#16a66a',
    warning: '#f59e0b',
    danger: '#f05252',
  },
  radius: { sm: 10, md: 16, lg: 24, pill: 999 },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
} as const;

export type MoajamTheme = typeof theme;

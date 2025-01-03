export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
} 
export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  textInverted: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  white: string;
  black: string;
  gray: string;
  disabled: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

export type CustomColors = ThemeColors; 
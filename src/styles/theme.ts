import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';

export const lightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4A90E2',
    background: '#F0F4F8',
    card: '#FFFFFF',
    text: '#1A1A1A',
    border: '#E1E1E1',
    notification: '#FF3B30',
  },
};

export const darkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#64FFDA',
    background: '#0A192F',
    card: '#172A45',
    text: '#E6F1FF',
    border: '#2D3748',
    notification: '#FF453A',
  },
};


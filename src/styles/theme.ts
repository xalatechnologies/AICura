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
  dark: true,
  colors: {
    primary: '#4FD1C5',
    background: '#0F172A',
    card: '#1E293B',
    text: '#E2E8F0',
    border: '#2D3748',
    notification: '#4FD1C5',
    userMessage: '#4FD1C5',
    aiMessage: '#1E293B',
    aiMessageBorder: '#2D3748',
    inputBackground: '#1E293B',
    placeholder: '#64748B',
  },
};


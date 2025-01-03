import { Theme } from './types';

export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#5AB19A',
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#E0E0E0',
    notification: '#FF3B30',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#5AB19A',
    background: '#1A1A1A',
    card: '#2C2C2C',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#404040',
    notification: '#FF453A',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
  },
}; 
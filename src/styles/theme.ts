import { Theme } from '@react-navigation/native';

interface CustomColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  card: string;
  notification: string;
  userMessage: string;
  aiMessage: string;
  aiMessageBorder: string;
}

export interface CustomTheme extends Theme {
  dark: boolean;
  colors: CustomColors;
}

export const lightTheme: CustomTheme = {
  dark: false,
  colors: {
    primary: '#4FD1C5',
    secondary: '#38B2AC',
    background: '#FFFFFF',
    surface: '#F7FAFC',
    card: '#FFFFFF',
    text: '#1A202C',
    textSecondary: '#4A5568',
    border: '#E2E8F0',
    notification: '#F56565',
    error: '#F56565',
    success: '#48BB78',
    warning: '#ECC94B',
    userMessage: '#4FD1C5',
    aiMessage: '#F7FAFC',
    aiMessageBorder: '#E2E8F0'
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '900',
    },
  }
};

export const darkTheme: CustomTheme = {
  dark: true,
  colors: {
    primary: '#4FD1C5',
    secondary: '#38B2AC',
    background: '#1A202C',
    surface: '#2D3748',
    card: '#2D3748',
    text: '#F7FAFC',
    textSecondary: '#A0AEC0',
    border: '#4A5568',
    notification: '#F56565',
    error: '#F56565',
    success: '#48BB78',
    warning: '#ECC94B',
    userMessage: '#4FD1C5',
    aiMessage: '#2D3748',
    aiMessageBorder: '#4A5568'
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '900',
    },
  }
};


import { Theme } from '@react-navigation/native';

export interface CustomColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  gradientPrimary: [string, string];
  
  // Background colors
  background: string;
  surface: string;
  surfaceHover: string;
  card: string;
  cardHover: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverted: string;
  
  // UI elements
  border: string;
  divider: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  
  // Interactive elements
  buttonPrimary: string;
  buttonSecondary: string;
  buttonDisabled: string;
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
  
  // Message colors
  userMessage: string;
  aiMessage: string;
  aiMessageBorder: string;
  
  // Status colors
  notification: string;
  active: string;
  inactive: string;
}

export interface CustomTheme extends Theme {
  dark: boolean;
  colors: CustomColors;
  fonts: {
    regular: {
      fontFamily: string;
      fontWeight: '400';
    };
    medium: {
      fontFamily: string;
      fontWeight: '500';
    };
    bold: {
      fontFamily: string;
      fontWeight: '700';
    };
    heavy: {
      fontFamily: string;
      fontWeight: '900';
    };
  };
}

export const lightTheme: CustomTheme = {
  dark: false,
  colors: {
    // Primary colors
    primary: '#008577',
    primaryLight: '#00A896',
    primaryDark: '#006D5B',
    secondary: '#26A69A',
    gradientPrimary: ['#008577', '#00A896'],
    
    // Background colors
    background: '#FFFFFF',
    surface: '#F8FAFB',
    surfaceHover: '#F0F4F5',
    card: '#FFFFFF',
    cardHover: '#F8FAFB',
    
    // Text colors
    text: '#1A2B3C',
    textSecondary: '#4A5B6C',
    textMuted: '#8A96A3',
    textInverted: '#FFFFFF',
    
    // UI elements
    border: '#E2E8F0',
    divider: '#EDF2F7',
    error: '#FF5252',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
    
    // Interactive elements
    buttonPrimary: '#008577',
    buttonSecondary: '#26A69A',
    buttonDisabled: '#CBD5E0',
    inputBackground: '#F8FAFB',
    inputBorder: '#E2E8F0',
    inputPlaceholder: '#A0AEC0',
    
    // Message colors
    userMessage: '#E8F5E9',
    aiMessage: '#F8FAFB',
    aiMessageBorder: '#E2E8F0',
    
    // Status colors
    notification: '#FF5252',
    active: '#4CAF50',
    inactive: '#9E9E9E',
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
    // Primary colors
    primary: '#00B5A1',
    primaryLight: '#00D4BD',
    primaryDark: '#009686',
    secondary: '#00B5A1',
    gradientPrimary: ['#00B5A1', '#00D4BD'],
    
    // Background colors
    background: '#0A1A2F',
    surface: '#122B44',
    surfaceHover: '#1A3A5A',
    card: '#122B44',
    cardHover: '#1A3A5A',
    
    // Text colors
    text: '#F8FAFB',
    textSecondary: '#B4C6D4',
    textMuted: '#8A96A3',
    textInverted: '#1A2B3C',
    
    // UI elements
    border: '#2A4A6A',
    divider: '#1E3A5A',
    error: '#FF5252',
    success: '#69F0AE',
    warning: '#FFD740',
    info: '#40C4FF',
    
    // Interactive elements
    buttonPrimary: '#00B5A1',
    buttonSecondary: '#00B5A1',
    buttonDisabled: '#4A5B6C',
    inputBackground: '#122B44',
    inputBorder: '#2A4A6A',
    inputPlaceholder: '#8A96A3',
    
    // Message colors
    userMessage: '#1E3A5A',
    aiMessage: '#122B44',
    aiMessageBorder: '#2A4A6A',
    
    // Status colors
    notification: '#FF5252',
    active: '#69F0AE',
    inactive: '#78909C',
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


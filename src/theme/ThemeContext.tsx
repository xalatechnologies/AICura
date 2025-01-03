import React, { createContext, useContext } from 'react';

export interface CustomColors {
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryDark: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
}

interface ThemeContextType {
  colors: CustomColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const lightColors: CustomColors = {
  primary: '#FF6B6B',
  primaryDark: '#FF5252',
  secondary: '#4A90E2',
  secondaryDark: '#357ABD',
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E5E7EB',
};

const darkColors: CustomColors = {
  primary: '#FF6B6B',
  primaryDark: '#FF5252',
  secondary: '#4A90E2',
  secondaryDark: '#357ABD',
  background: '#1A1A1A',
  card: '#2D2D2D',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  border: '#404040',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const value = {
    colors: isDark ? darkColors : lightColors,
    isDark,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
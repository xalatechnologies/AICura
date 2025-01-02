import React, { createContext, useContext, useState } from 'react';
import { lightTheme, darkTheme } from '@styles/theme';
import type { CustomTheme } from '@styles/theme';

interface ThemeContextType {
  theme: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
  colors: CustomTheme['colors'];
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    colors: theme === 'dark' ? darkTheme.colors : lightTheme.colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create the hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return {
    ...context,
    colors: context.isDark ? darkTheme.colors : lightTheme.colors,
  };
}; 
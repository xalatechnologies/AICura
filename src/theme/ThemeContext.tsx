import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomTheme, lightTheme, darkTheme } from '../styles/theme';

export type ThemeContextType = {
  colors: CustomTheme['colors'];
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<CustomTheme>(
    Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme
  );
  const [colorScheme, setColorSchemeState] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setColorSchemeState(savedTheme as ColorSchemeName);
        setTheme(savedTheme === 'dark' ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setColorScheme = async (scheme: ColorSchemeName) => {
    try {
      await AsyncStorage.setItem('theme', scheme || 'light');
      setColorSchemeState(scheme);
      setTheme(scheme === 'dark' ? darkTheme : lightTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleColorScheme = async () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    await setColorScheme(newScheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        colors: theme.colors,
        isDark: colorScheme === 'dark',
        toggleTheme: toggleColorScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
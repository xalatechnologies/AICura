import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, DefaultTheme, DarkTheme } from '@react-navigation/native';

interface ThemeContextType {
  theme: Theme;
  dark: boolean;
  setTheme: (scheme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DefaultTheme,
  dark: false,
  setTheme: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>(
    systemColorScheme === 'dark' ? DarkTheme : DefaultTheme
  );

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setThemeState(savedTheme === 'dark' ? DarkTheme : DefaultTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (scheme: 'light' | 'dark') => {
    try {
      await AsyncStorage.setItem('theme', scheme);
      setThemeState(scheme === 'dark' ? DarkTheme : DefaultTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const value = {
    theme,
    dark: theme === DarkTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

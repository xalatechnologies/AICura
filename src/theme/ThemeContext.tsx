import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ColorScheme } from './types';
import { lightTheme, darkTheme } from './themes';
import { useAuth } from '@contexts/AuthContext';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => Promise<void>;
  toggleColorScheme: () => Promise<void>;
  colors: Theme['colors'];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(
    Appearance.getColorScheme() || 'light'
  );
  const { userProfile, updateProfile } = useAuth();

  useEffect(() => {
    loadSavedTheme();
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      if (!userProfile?.theme) {
        setColorSchemeState(newColorScheme as ColorScheme || 'light');
      }
    });

    return () => subscription.remove();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = userProfile?.theme as ColorScheme || 
                        await AsyncStorage.getItem('theme') || 
                        Appearance.getColorScheme() || 
                        'light';
      setColorSchemeState(savedTheme);
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setColorScheme = async (newScheme: ColorScheme) => {
    try {
      setColorSchemeState(newScheme);
      await AsyncStorage.setItem('theme', newScheme);
      if (userProfile) {
        await updateProfile({ theme: newScheme });
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleColorScheme = async () => {
    const newScheme = colorScheme === 'light' ? 'dark' : 'light';
    await setColorScheme(newScheme);
  };

  const value = {
    theme: colorScheme === 'light' ? lightTheme : darkTheme,
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    colors: (colorScheme === 'light' ? lightTheme : darkTheme).colors,
  };

  return (
    <ThemeContext.Provider value={value}>
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
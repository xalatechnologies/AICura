import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './RootNavigator';
import { useTheme } from '@theme/ThemeContext';
import { lightTheme } from '@styles/theme';

export const AppContent = () => {
  const { colors, isDark } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: colors,
        fonts: lightTheme.fonts
      }}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}; 
import React from 'react';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { RootNavigator } from './RootNavigator';

const AppContent = () => {
  const { isDark } = useTheme();

  const theme: Theme = {
    dark: isDark,
    colors: {
      primary: isDark ? '#0A84FF' : '#007AFF',
      background: isDark ? '#000000' : '#FFFFFF',
      card: isDark ? '#1C1C1E' : '#FFFFFF',
      text: isDark ? '#FFFFFF' : '#000000',
      border: isDark ? '#38383A' : '#C6C6C8',
      notification: isDark ? '#FF453A' : '#FF3B30',
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
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppContent; 
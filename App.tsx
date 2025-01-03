import React from 'react';
import { AppContent } from './src/navigation/AppContent';
import { ThemeProvider } from './src/theme/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}


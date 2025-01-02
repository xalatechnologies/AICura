import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from './src/theme/ThemeContext';
import i18n from './src/i18n';
import AppContent from './src/navigation/AppContent.js';

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}


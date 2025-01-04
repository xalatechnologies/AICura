import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { ThemeHeader } from '@components/ThemeHeader';
import { LanguageSelector } from '@components/LanguageSelector';

export const LanguageSelectionScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemeHeader showBack />
      <View style={styles.content}>
        <LanguageSelector />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
}); 
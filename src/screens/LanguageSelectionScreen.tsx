import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Header } from '@components/shared/Header';
import { LanguageSelector } from '@components/LanguageSelector';

export const LanguageSelectionScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={t('language.selection.title')} 
        showBack 
      />
      <View style={styles.content}>
        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
          {t('language.selection.instruction')}
        </Text>
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
  instruction: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
}); 
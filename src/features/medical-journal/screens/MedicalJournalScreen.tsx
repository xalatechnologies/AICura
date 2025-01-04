import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/shared/Header';

export const MedicalJournalScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={t('medicalJournal.title')}
        rightAction={{
          icon: 'add',
          onPress: () => {/* Handle new entry */}
        }}
      />
      <View style={styles.content}>
        <Text style={[styles.text, { color: colors.text }]}>
          {t('medicalJournal.emptyState')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 
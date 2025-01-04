import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { useTranslation } from 'react-i18next';

interface StartAnalysisButtonProps {
  onPress: () => void;
}

export const StartAnalysisButton = ({ onPress }: StartAnalysisButtonProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.primary }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{t('symptoms.startAnalysis')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
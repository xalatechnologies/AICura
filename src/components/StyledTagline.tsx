import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { useTranslation } from 'react-i18next';

interface StyledTaglineProps {
  style?: any;
}

export const StyledTagline = ({ style }: StyledTaglineProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Text style={[styles.tagline, { color: colors.textSecondary }, style]}>
      {t('common.tagline')}
    </Text>
  );
};

const styles = StyleSheet.create({
  tagline: {
    fontSize: 18,
    marginTop: 8,
    fontWeight: '300',
    textAlign: 'center',
  },
}); 
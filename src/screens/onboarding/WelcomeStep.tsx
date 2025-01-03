import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@theme/ThemeContext';

export const WelcomeStep = React.memo(() => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.stepContent}>
      <View style={styles.welcomeContainer}>
        <Icon name="heart" size={80} color={colors.primary} />
        <Text style={[styles.stepTitle, { color: colors.text }]}>
          {t('onboarding.welcome.title')}
        </Text>
        <Text style={[styles.stepDescription, { color: colors.text }]}>
          {t('onboarding.welcome.description')}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  stepContent: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 20,
  },
}); 
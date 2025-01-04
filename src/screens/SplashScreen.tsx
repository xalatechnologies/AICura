import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { useTranslation } from 'react-i18next';

export const SplashScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require('@assets/images/playstore.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: colors.text }]}>
        {t('splash.appTitle')}
      </Text>
      <Text style={[styles.tagline, { color: colors.textSecondary }]}>
        {t('splash.tagline')}
      </Text>
      <Text style={[styles.loading, { color: colors.primary }]}>
        {t('splash.loading')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '100%',
    height: 300,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  loading: {
    fontSize: 16,
    fontWeight: '500',
  },
});

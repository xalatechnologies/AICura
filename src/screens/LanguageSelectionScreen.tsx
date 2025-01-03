import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/RootNavigator';
import { LanguageSelector } from '@components/LanguageSelector';
import { useTranslation } from 'react-i18next';

type LanguageSelectionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LanguageSelection'>;
};

export const LanguageSelectionScreen = ({ navigation }: LanguageSelectionScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleLanguageChange = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require('../assets/images/playstore.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: colors.text }]}>
        {t('welcome.title', 'Welcome to AICura™')}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {t('welcome.selectLanguage', 'Choose your preferred language')}
      </Text>
      <LanguageSelector 
        onLanguageChange={handleLanguageChange}
        showTitle={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
}); 
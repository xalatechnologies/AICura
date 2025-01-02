import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { isSupabaseConfigured } from '@lib/supabase';
import { useAuth } from '@contexts/AuthContext';
import { changeLanguage } from '@i18n/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  icon: string;
}

const languages: Language[] = [
  { 
    code: 'en',
    name: 'English',
    nativeName: 'English',
    icon: 'language-outline'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    icon: 'language-outline'
  },
  {
    code: 'no',
    name: 'Norwegian',
    nativeName: 'Norsk',
    icon: 'language-outline'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    icon: 'language-outline'
  }
];

export const LanguageSelectionScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { updateProfile } = useAuth();

  const handleLanguageSelect = async (language: Language) => {
    try {
      // Change app language
      await changeLanguage(language.code);

      // Save language preference locally
      await AsyncStorage.setItem('userLanguage', language.code);

      // Update profile if Supabase is configured
      if (isSupabaseConfigured()) {
        await updateProfile({ language: language.code });
      }

      // Navigate to next screen
      navigation.navigate('Onboarding');
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('onboarding.selectLanguage')}
      </Text>
      
      <View style={styles.languageList}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[styles.languageButton, { backgroundColor: colors.card }]}
            onPress={() => handleLanguageSelect(language)}
          >
            <Icon name={language.icon} size={32} color={colors.primary} style={styles.icon} />
            <View style={styles.languageInfo}>
              <Text style={[styles.languageName, { color: colors.text }]}>
                {language.name}
              </Text>
              <Text style={[styles.nativeName, { color: colors.text }]}>
                {language.nativeName}
              </Text>
            </View>
            <Icon name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  languageList: {
    width: '100%',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 15,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
  },
  nativeName: {
    fontSize: 14,
    opacity: 0.8,
  },
}); 
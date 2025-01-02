import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { changeLanguage } from '../i18n';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: any;
}

const languages: Language[] = [
  { 
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: require('../assets/flags/en.png')
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: require('../assets/flags/es.png')
  },
  {
    code: 'no',
    name: 'Norwegian',
    nativeName: 'Norsk',
    flag: require('../assets/flags/no.png')
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: require('../assets/flags/ar.png')
  }
];

export const LanguageSelectionScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleLanguageSelect = async (language: Language) => {
    try {
      // Change app language
      await changeLanguage(language.code);

      // Save to Supabase if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            language: language.code,
            updated_at: new Date().toISOString(),
          });
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
            <Image source={language.flag} style={styles.flag} />
            <View style={styles.languageInfo}>
              <Text style={[styles.languageName, { color: colors.text }]}>
                {language.name}
              </Text>
              <Text style={[styles.nativeName, { color: colors.text }]}>
                {language.nativeName}
              </Text>
            </View>
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
  flag: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
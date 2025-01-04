import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeLanguage } from '@i18n/index';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/RootNavigator';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  icon: string;
  direction?: 'ltr' | 'rtl';
}

interface LanguageSelectorProps {
  onLanguageChange?: (language: Language) => void;
  showTitle?: boolean;
}

const languages: Language[] = [
  { 
    code: 'en',
    name: 'English',
    nativeName: 'English',
    icon: 'language',
    direction: 'ltr'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    icon: 'language',
    direction: 'ltr'
  },
  {
    code: 'nb',
    name: 'Norwegian Bokmål',
    nativeName: 'Norsk bokmål',
    icon: 'language',
    direction: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    icon: 'language',
    direction: 'rtl'
  },
  {
    code: 'fa-AF',
    name: 'Dari',
    nativeName: 'دری',
    icon: 'language',
    direction: 'rtl'
  },
  {
    code: 'ps',
    name: 'Pashto',
    nativeName: 'پښتو',
    icon: 'language',
    direction: 'rtl'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    icon: 'language',
    direction: 'rtl'
  }
];

export const LanguageSelector = ({ onLanguageChange, showTitle = true }: LanguageSelectorProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLanguageSelect = async (language: Language) => {
    try {
      await changeLanguage(language.code);
      
      await Promise.all([
        AsyncStorage.setItem('selectedLanguage', language.code),
        AsyncStorage.setItem('languageDirection', language.direction || 'ltr')
      ]);

      if (onLanguageChange) {
        onLanguageChange(language);
      }

      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Welcome');
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.languageList}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[styles.languageButton, { backgroundColor: colors.card }]}
            onPress={() => handleLanguageSelect(language)}
          >
            <Icon name="language" size={24} color={colors.primary} style={styles.icon} />
            <View style={styles.languageInfo}>
              <Text style={[styles.languageName, { color: colors.text }]}>
                {language.name}
              </Text>
              <Text style={[styles.nativeName, { color: colors.textSecondary }]}>
                {language.nativeName}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  languageList: {
    width: '100%',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 16,
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
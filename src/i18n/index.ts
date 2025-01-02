import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import en from './translations/en.json';
import es from './translations/es.json';
import no from './translations/no.json';
import ar from './translations/ar.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  no: { translation: no },
  ar: { translation: ar },
};

const fallbackLanguage = 'en';
const supportedLanguages = Object.keys(resources);

// Get device locale without RNLocalize
const getDeviceLocale = (): string => {
  if (Platform.OS === 'ios') {
    const locale = NativeModules.SettingsManager?.settings?.AppleLocale ||
                  NativeModules.SettingsManager?.settings?.AppleLanguages[0];
    return locale ? locale.slice(0, 2) : fallbackLanguage;
  } else if (Platform.OS === 'android') {
    return NativeModules.I18nManager?.localeIdentifier?.slice(0, 2) || fallbackLanguage;
  }
  return fallbackLanguage;
};

// Get best available language
const getBestLanguage = async (): Promise<string> => {
  try {
    // First check if user has a saved preference
    const savedLanguage = await AsyncStorage.getItem('userLanguage');
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      return savedLanguage;
    }

    // Try to get device language
    const deviceLanguage = getDeviceLocale();
    if (supportedLanguages.includes(deviceLanguage)) {
      return deviceLanguage;
    }

    return fallbackLanguage;
  } catch (error) {
    console.warn('Error getting language preference:', error);
    return fallbackLanguage;
  }
};

// Initialize i18n
const initializeI18n = async () => {
  try {
    const language = await getBestLanguage();
    
    // Configure RTL
    const isRTL = language === 'ar';
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }

    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: language,
        fallbackLng: fallbackLanguage,
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });

    // Save initial language preference
    await AsyncStorage.setItem('userLanguage', language);
  } catch (error) {
    console.error('Error initializing i18n:', error);
  }
};

export const changeLanguage = async (language: string) => {
  try {
    if (!supportedLanguages.includes(language)) {
      throw new Error('Unsupported language');
    }

    await i18n.changeLanguage(language);
    await AsyncStorage.setItem('userLanguage', language);
    
    const isRTL = language === 'ar';
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      // Note: App reload will be handled by the parent component
    }
  } catch (error: any) {
    console.error('Error changing language:', error);
    // Don't throw the error if user is not logged in
    if (error.message !== 'No user logged in') {
      throw error;
    }
  }
};

// Initialize
initializeI18n();

export default i18n; 
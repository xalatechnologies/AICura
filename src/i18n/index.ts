import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './translations/en.json';
import es from './translations/es.json';
import no from './translations/no.json';
import ar from './translations/ar.json';
import ps from './translations/ps.json';
import faAF from './translations/fa-AF.json';
import ur from './translations/ur.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  no: { translation: no },
  ar: { translation: ar },
  ps: { translation: ps },
  'fa-AF': { translation: faAF },
  ur: { translation: ur }
};

export const changeLanguage = async (languageCode: string) => {
  try {
    await i18n.changeLanguage(languageCode);
    await AsyncStorage.setItem('selectedLanguage', languageCode);
    return true;
  } catch (error) {
    console.error('Error changing language:', error);
    return false;
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
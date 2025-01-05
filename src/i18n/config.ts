import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

// Import translations
import ar from './translations/ar.json';
import en from './translations/en.json';
import es from './translations/es.json';
import fa from './translations/fa-AF.json';
import nb from './translations/nb.json';
import ps from './translations/ps.json';
import ur from './translations/ur.json';

const resources = {
  ar: { translation: ar },
  en: { translation: en },
  es: { translation: es },
  fa: { translation: fa },
  nb: { translation: nb },
  ps: { translation: ps },
  ur: { translation: ur },
};

// Handle RTL languages
const RTL_LANGUAGES = ['ar', 'fa', 'ur'];
const currentLocale = Localization.locale.split('-')[0];
I18nManager.allowRTL(RTL_LANGUAGES.includes(currentLocale));
I18nManager.forceRTL(RTL_LANGUAGES.includes(currentLocale));

i18n
  .use(initReactI18next)
  .init({
    resources: resources,
    lng: currentLocale,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

export default i18n;

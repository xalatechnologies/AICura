import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { I18nManager } from 'react-native';

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

// Get device language and check if it's supported
const deviceLanguages = RNLocalize.getLocales().map(locale => locale.languageCode);
const deviceLanguage = deviceLanguages.find(language => supportedLanguages.includes(language)) || fallbackLanguage;

// Configure RTL
const isRTL = deviceLanguage === 'ar';
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage,
    fallbackLng: fallbackLanguage,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language);
  const isRTL = language === 'ar';
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
  // Reload app to apply RTL changes if needed
  if (isRTL !== I18nManager.isRTL) {
    // Add logic to reload app
  }
};

export default i18n; 
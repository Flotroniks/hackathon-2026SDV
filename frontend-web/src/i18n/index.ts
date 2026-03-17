import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from '../locales/fr/translation.json';
import en from '../locales/en/translation.json';

const LANGUAGE_STORAGE_KEY = 'carbon_language';
const DEFAULT_LANGUAGE = 'fr';

type AppLanguage = 'fr' | 'en';

function isAppLanguage(value: string | null): value is AppLanguage {
  return value === 'fr' || value === 'en';
}

function getInitialLanguage(): AppLanguage {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isAppLanguage(savedLanguage)) {
    return savedLanguage;
  }
  return DEFAULT_LANGUAGE;
}

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
});

export function changeAppLanguage(language: AppLanguage): void {
  i18n.changeLanguage(language);
}

export default i18n;


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import arTranslations from './locales/ar.json';

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      fr: {
        translation: frTranslations
      },
      ar: {
        translation: arTranslations
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    returnNull: false,
    returnEmptyString: false,
    keySeparator: '.',
    debug: process.env.NODE_ENV === 'development',
    
    // Fix for TypeScript compatibility with React components
    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'em', 'span'],
      // This ensures ReactNode compatibility
      transWrapTextNodes: '',
    }
  });

// Add debugging for i18n
i18n.on('initialized', () => {
  console.log('i18n initialized with language:', i18n.language);
});

i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  
  // Add RTL handling for Arabic
  if (lng === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    document.body.classList.add('rtl');
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lng;
    document.body.classList.remove('rtl');
  }
});

export default i18n;


import 'react-i18next';
import { ReactNode } from 'react';
import enTranslations from '../locales/en.json';

// Enhance the module declarations for react-i18next
declare module 'react-i18next' {
  interface CustomTypeOptions {
    // Custom resources type
    resources: {
      translation: typeof enTranslations;
    };
    // Force compatibility between React types and i18next
    reactI18nextChildren: ReactNode;
    
    // Ensure all components accept React nodes
    components: {
      // Add props interfaces for any components you might use in translations
    };
  }
}


import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'

// Add debugging for i18n
import i18n from 'i18next';

i18n.on('initialized', () => {
  console.log('i18n initialized with language:', i18n.language);
});

i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
});

createRoot(document.getElementById("root")!).render(<App />);

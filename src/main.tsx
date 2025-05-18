
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'

// Add debugging for i18n
import i18n from 'i18next';

i18n.on('initialized', () => {
  console.log('i18n initialized with language:', i18n.language);
  console.log('Available namespaces:', i18n.options.ns);
  console.log('Available resources:', i18n.options.resources);
});

i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
});

createRoot(document.getElementById("root")!).render(<App />);

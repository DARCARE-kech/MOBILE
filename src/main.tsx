
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import i18n directly
import i18n from './i18n'

// No need for additional debugging setup since it's already in i18n.ts
// The imported i18n object already has these event listeners attached
// in the i18n.ts file

createRoot(document.getElementById("root")!).render(<App />);

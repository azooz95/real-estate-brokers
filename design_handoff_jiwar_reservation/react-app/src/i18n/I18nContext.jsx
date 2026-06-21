import { createContext, useContext, useEffect, useState } from 'react';
import { STR } from './strings.js';

// Locale + direction provider. Sets <html dir/lang> so the whole tree mirrors
// for Arabic and the IBM Plex Sans Arabic face kicks in (see index.css).
//
// Admin and Client are SEPARATE sites (separate domains) — each mounts its own
// provider with its own `storageKey` so the two remember language independently.
const I18nContext = createContext(null);

export function I18nProvider({ children, storageKey = 'lang', defaultLang = 'en' }) {
  const [lang, setLang] = useState(() => localStorage.getItem(storageKey) || defaultLang);

  useEffect(() => {
    localStorage.setItem(storageKey, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang, storageKey]);

  const dict = STR[lang] || STR.en;
  const t = (key) => dict[key] ?? STR.en[key] ?? key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);

'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, Language } from '../lib/translations';

type LanguageContextType = {
  lang: Language;
  t: typeof translations['en']; // default type structure
  toggleLanguage: () => void;
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const toggleLanguage = () => {
    setLang((prev) => {
      if (prev === 'en') return 'fr'; // English -> French
      if (prev === 'fr') return 'ar'; // French -> Arabic
      return 'en';                    // Arabic -> English
    });
  };

  // Handle RTL vs LTR automatically
  useEffect(() => {
    // Only Arabic is Right-to-Left (RTL)
    // English and French are Left-to-Right (LTR)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const value = {
    lang,
    t: translations[lang], // Load correct dictionary
    toggleLanguage,
    isRTL: lang === 'ar',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
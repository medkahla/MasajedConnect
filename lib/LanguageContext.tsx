"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'fr' | 'en';
type Direction = 'rtl' | 'ltr';

interface Translations {
  [key: string]: {
    ar: string;
    fr: string;
    en: string;
  };
}

// Simple translation dictionary
const translations: Translations = {
  // Navigation & General
  "app.title": { ar: "مساجد كونكت", fr: "MasajedConnect", en: "MasajedConnect" },
  "nav.home": { ar: "الرئيسية", fr: "Accueil", en: "Home" },
  "nav.login": { ar: "تسجيل الدخول", fr: "Connexion", en: "Login" },
  "nav.dashboard": { ar: "لوحة التحكم", fr: "Tableau de bord", en: "Dashboard" },
  "nav.logout": { ar: "تسجيل الخروج", fr: "Déconnexion", en: "Logout" },

  // Hero & Search
  "hero.title": { ar: "اعثر على أقرب مسجد إليك", fr: "Trouvez la mosquée la plus proche", en: "Find the nearest mosque" },
  "hero.subtitle": { ar: "مواقيت الصلاة، الخدمات، والأخبار من مساجد منطقتك", fr: "Horaires de prière, services et actualités de votre région", en: "Prayer times, services, and news from your area" },
  "search.placeholder": { ar: "ابحث عن مدينة أو اسم مسجد...", fr: "Rechercher une ville ou une mosquée...", en: "Search for a city or mosque..." },
  "search.action": { ar: "بحث", fr: "Rechercher", en: "Search" },

  // Map & Lists
  "map.view": { ar: "الخريطة", fr: "Carte", en: "Map" },
  "list.view": { ar: "القائمة", fr: "Liste", en: "List" },
  "featured.mosques": { ar: "مساجد مميزة", fr: "Mosquées à la une", en: "Featured Mosques" },

  // Mosque Details
  "mosque.address": { ar: "العنوان", fr: "Adresse", en: "Address" },
  "mosque.prayers": { ar: "مواقيت الصلاة", fr: "Horaires de prière", en: "Prayer Times" },
  "mosque.services": { ar: "الخدمات", fr: "Services", en: "Services" },
  "mosque.needs": { ar: "احتياجات المسجد", fr: "Besoins", en: "Needs" },
  "mosque.events": { ar: "الأحداث القادمة", fr: "Événements à venir", en: "Upcoming Events" },

  // Prayer Names
  "prayer.fajr": { ar: "الفجر", fr: "Fajr", en: "Fajr" },
  "prayer.dhuhr": { ar: "الظهر", fr: "Dhuhr", en: "Dhuhr" },
  "prayer.asr": { ar: "العصر", fr: "Asr", en: "Asr" },
  "prayer.maghrib": { ar: "المغرب", fr: "Maghrib", en: "Maghrib" },
  "prayer.isha": { ar: "العشاء", fr: "Isha", en: "Isha" },
  "prayer.jumuah": { ar: "الجمعة", fr: "Jumu'ah", en: "Jumu'ah" },
  "prayer.iqamah": { ar: "الإقامة", fr: "Iqamah", en: "Iqamah" },
  "prayer.adhan": { ar: "الأذان", fr: "Adhan", en: "Adhan" },

  // Auth
  "login.title": { ar: "تسجيل الدخول للمشرفين", fr: "Connexion Superviseur", en: "Supervisor Login" },
  "login.email": { ar: "البريد الإلكتروني", fr: "Email", en: "Email" },
  "login.password": { ar: "كلمة المرور", fr: "Mot de passe", en: "Password" },
  "login.submit": { ar: "دخول", fr: "Se connecter", en: "Sign In" },
  "login.register_prompt": { ar: "ليس لديك حساب؟", fr: "Pas de compte ?", en: "No account?" },
  "login.register_link": { ar: "قدم طلب انضمام", fr: "Demander l'accès", en: "Request Access" },

  // Dashboard
  "dash.welcome": { ar: "مرحباً", fr: "Bienvenue", en: "Welcome" },
  "dash.profile": { ar: "الملف التعريفي", fr: "Profil", en: "Profile" },
  "dash.prayers": { ar: "المواقيت", fr: "Horaires", en: "Times" },
  "dash.events": { ar: "الأحداث", fr: "Événements", en: "Events" },
  "dash.save": { ar: "حفظ التغييرات", fr: "Enregistrer", en: "Save Changes" },
  "dash.cancel": { ar: "إلغاء", fr: "Annuler", en: "Cancel" },
};

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [direction, setDirection] = useState<Direction>('rtl');

  useEffect(() => {
    // Update HTML direction when language changes
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

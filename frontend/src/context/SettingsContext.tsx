import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "dark" | "light";
type Language = "en" | "fr";

interface SettingsContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  strings: Record<string, Record<string, string>>;
}

const translations = {
  en: {
    common: {
      searchConsole: "Search console...",
      signOut: "Sign Out",
      login: "Login",
      startFreeTrial: "Start Free Trial",
      switchToLight: "Switch to light mode",
      switchToDark: "Switch to dark mode",
      language: "Language",
      openMenu: "Open navigation"
    },
    nav: {
      dashboard: "Dashboard",
      incidents: "Incidents",
      analysis: "File Analysis",
      evidence: "Evidence & Custody",
      timeline: "Investigation Timeline",
      users: "User Management",
      audit: "Audit Log",
      settings: "Settings",
      profile: "Profile"
    },
    auth: {
      welcomeBack: "Welcome back",
      signInToContinue: "Sign in to your analyst console",
      twoFactor: "Two-factor auth",
      enterCode: "Enter your authenticator code to continue",
      email: "Email address",
      password: "Password",
      signIn: "Sign in",
      backToCredentials: "Back to credentials",
      orContinueWith: "Or continue with",
      verifyAndSign: "Verify and sign session",
      forgotPassword: "Forgot password?"
    },
    landing: {
      title: "Next-Gen Incident Response",
      description: "Automated evidence collection with cryptographic integrity, YARA signature scanning, and compliance-ready reports.",
      features: "Features",
      platform: "Platform",
      pricing: "Pricing",
      learnMore: "Learn More",
      startFreeTrial: "Start Free Trial"
    },
    settings: {
      title: "System Settings",
      description: "Manage integrations, API connections, retention schedules, and YARA rule assets."
    }
  },
  fr: {
    common: {
      searchConsole: "Rechercher...",
      signOut: "Déconnexion",
      login: "Connexion",
      startFreeTrial: "Essai gratuit",
      switchToLight: "Passer au mode clair",
      switchToDark: "Passer au mode sombre",
      language: "Langue",
      openMenu: "Ouvrir la navigation"
    },
    nav: {
      dashboard: "Tableau de bord",
      incidents: "Incidents",
      analysis: "Analyse de fichiers",
      evidence: "Preuves et chaîne de garde",
      timeline: "Chronologie d’enquête",
      users: "Gestion des utilisateurs",
      audit: "Journal d’audit",
      settings: "Paramètres",
      profile: "Profil"
    },
    auth: {
      welcomeBack: "Bon retour",
      signInToContinue: "Connectez-vous à votre console d’analyse",
      twoFactor: "Authentification à deux facteurs",
      enterCode: "Saisissez votre code d’authentification pour continuer",
      email: "Adresse e-mail",
      password: "Mot de passe",
      signIn: "Se connecter",
      backToCredentials: "Retour aux identifiants",
      orContinueWith: "Ou continuer avec",
      verifyAndSign: "Vérifier et ouvrir la session",
      forgotPassword: "Mot de passe oublié ?"
    },
    landing: {
      title: "Réponse aux incidents de nouvelle génération",
      description: "Collecte automatisée des preuves, intégrité cryptographique, analyse YARA et rapports conformes aux exigences réglementaires.",
      features: "Fonctionnalités",
      platform: "Plateforme",
      pricing: "Tarifs",
      learnMore: "En savoir plus",
      startFreeTrial: "Commencer l’essai"
    },
    settings: {
      title: "Paramètres système",
      description: "Gérez les intégrations, les connexions API, la rétention des données et les signatures YARA."
    }
  }
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    return (window.localStorage.getItem("theme") as ThemeMode) || "dark";
  });
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return (window.localStorage.getItem("language") as Language) || "en";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    document.documentElement.setAttribute("data-language", language);
    window.localStorage.setItem("theme", theme);
    window.localStorage.setItem("language", language);
  }, [theme, language]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const toggleLanguage = () => {
    setLanguage((current) => (current === "en" ? "fr" : "en"));
  };

  const value = useMemo<SettingsContextValue>(() => ({
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    strings: translations[language]
  }), [theme, language]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

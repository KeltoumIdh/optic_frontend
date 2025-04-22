import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

const resources = {
  fr: {
    translation: fr,
  },
  ar: {
    translation: ar,
  },
  en: {
    translation: en,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: ["fr", "en"],
    supportedLngs: ["fr", "ar", "en"],
    lng: localStorage.getItem("i18nextLng") || "fr",
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

// Set initial direction
const setDirection = () => {
  document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = i18n.language;
};

i18n.on("languageChanged", setDirection);
setDirection();

export default i18n;

// src/i18n/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import file ngôn ngữ
import en from "./locales/en.json";
import vi from "./locales/vi.json";

i18n
  .use(LanguageDetector) // Tự phát hiện ngôn ngữ trình duyệt
  .use(initReactI18next) // Kết nối với React
  .init({
    resources: {
      en: {
        translation: en,
      },
      vi: {
        translation: vi,
      },
    },
    fallbackLng: "en", // Nếu không phát hiện được thì mặc định tiếng Anh
    interpolation: {
      escapeValue: false, // React đã tự bảo vệ XSS rồi nên không cần escape
    },
  });

export default i18n;

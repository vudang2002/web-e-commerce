import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useLanguage = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") || "en";
    setLanguage(saved);
    i18n.changeLanguage(saved);
  }, [i18n]);

  const changeLanguage = (value) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    localStorage.setItem("lang", value);
  };

  return { language, changeLanguage };
};

export default useLanguage;

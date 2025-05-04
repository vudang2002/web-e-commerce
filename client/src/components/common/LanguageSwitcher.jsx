import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng); // Lưu lựa chọn vào localStorage để nhớ khi reload
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleChangeLanguage("en")}
        className={`px-3 py-1 rounded ${
          i18n.language === "en" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        English
      </button>
      <button
        onClick={() => handleChangeLanguage("vi")}
        className={`px-3 py-1 rounded ${
          i18n.language === "vi" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Tiếng Việt
      </button>
    </div>
  );
}

export default LanguageSwitcher;

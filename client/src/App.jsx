import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/common/LanguageSwitcher";
function App() {
  const { t } = useTranslation();
  return (
    <div className="text-xl text-neutral-500 items-center justify-center">
      <h1>{t("welcome")}</h1>
      <div className="flex items-center gap-2 text-cyan-300">
        <LanguageSwitcher />
      </div>
    </div>
  );
}

export default App;

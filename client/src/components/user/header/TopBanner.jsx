import useLanguage from "../../../hooks/useLanguage"; // Đảm bảo đường dẫn đúng
import NavMenu from "./NavMenu"; // Đảm bảo đường dẫn đúng
import { useState } from "react";
import { MdMenu, MdCancelPresentation } from "react-icons/md"; // Đảm bảo đường dẫn đúng
import MobileMenu from "./MobileMenu"; // Đảm bảo đường dẫn đúng
const TopBanner = () => {
  const { language, changeLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-primary text-white text-[12px] md:text-sm lg:text-sm py-2 px-4">
      <div
        className="max-w-[1280px] mx-auto flex justify-between items-center 
      max-h-40 object-cover"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeLanguage("vi")}
            className={`px-1 py-1 ${
              language === "vi" ? "font-bold underline" : "opacity-70"
            }`}
          >
            Tiếng Việt
          </button>
          <span>|</span>
          <button
            onClick={() => changeLanguage("en")}
            className={`px-1 py-1 ${
              language === "en" ? "font-bold underline" : "opacity-70"
            }`}
          >
            English
          </button>
        </div>
        <div className="hidden md:flex">
          <NavMenu isMobile={false} />
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? (
              <MdCancelPresentation size={24} />
            ) : (
              <MdMenu size={24} />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
};

export default TopBanner;

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const NavMenu = ({ isMobile }) => {
  const linkClass = isMobile
    ? "block py-2 text-sm"
    : "text-sm sm:text-base md:text-[14px] font-medium text-white hover:text-neutral-500 transition-colors";
  const { t } = useTranslation();

  return (
    <>
      <nav
        className={
          isMobile ? "" : "flex gap-6 text-[12px] md:text-sm lg:text-[15px]"
        }
      >
        <Link to="/" className={linkClass}>
          {t("navbar.home")}
        </Link>
        <Link to="/contact" className={linkClass}>
          {t("navbar.contact")}
        </Link>
        <Link to="/about" className={linkClass}>
          {t("navbar.about")}
        </Link>
      </nav>
    </>
  );
};

export default NavMenu;

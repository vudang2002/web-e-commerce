import NavMenu from "./NavMenu";
import SearchBox from "./SearchBox";
import { MdCancelPresentation } from "react-icons/md";

const MobileMenu = ({ onClose }) => {
  return (
    <div className="md:hidden fixed top-2 right-2 min-w-40 w-fit max-w-xs bg-white z-50 shadow-lg px-4 pb-4 pt-4 rounded-lg border">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        onClick={onClose}
        aria-label="Đóng menu"
      >
        <MdCancelPresentation size={24} />
      </button>
      <div className="text-black pt-6">
        <NavMenu isMobile={true} />
      </div>
    </div>
  );
};

export default MobileMenu;

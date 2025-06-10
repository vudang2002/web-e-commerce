import { useState } from "react";
import TopBanner from "./TopBanner";
import SearchBox from "./SearchBox";
import CartIcon from "./CartIcon";
import UserMenu from "./UserMenu";
import { useEffect } from "react";
import { logout } from "../../../services/authService";
import AuthModal from "../../auth/AuthModal";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user"); // Remove invalid data
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };
  return (
    <header className="w-full border-gray-800 bg-white shadow-md sticky top-0 z-50">
      {/* Top Banner */}

      <TopBanner />

      {/* Main Header */}
      <div
        className="flex items-center max-w-[1280px] max-h-[100px] 
        mx-auto px-4 py-4 border-b"
      >
        {/* Logo */}
        <div
          className="flex-shrink-0 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="images/logo.jpg"
            alt="logo"
            className="w-[150px] object-cover"
          />
        </div>
        {/* SearchBox ở giữa */}
        <div className="flex-1 mx-8 hidden md:block">
          <SearchBox />
        </div>
        {/* Cart và Tài khoản bên phải */}
        <div className="flex items-center gap-4 justify-end">
          <CartIcon />
          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="py-1 px-3 text-sm bg-primary h-9 text-white  rounded-lg 
              flex items-center"
              aria-label="Open login modal"
            >
              Tài Khoản
            </button>
          )}
        </div>
      </div>
      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLoginSuccess={(user) => {
          setUser(user); // Update user state immediately after login
          setIsOpen(false); // Close the modal
        }}
      />
    </header>
  );
};

export default Header;

import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import TopBanner from "./TopBanner";
import SearchBox from "./SearchBox";
import CartIcon from "./CartIcon";
import { logout } from "../../../services/authService";
import AuthModal from "../../auth/AuthModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
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
            <div
              className="relative"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              {/* User Avatar/Button */}
              <div className="cursor-pointer flex items-center gap-2 border border-gray-300 rounded-full p-2 hover:bg-gray-50 transition-colors">
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <>
                  {/* Invisible bridge to prevent menu from disappearing */}
                  <div className="absolute right-0 top-full w-48 h-1 z-40"></div>

                  <div
                    className="absolute right-0 top-full mt-1 z-50 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-2"
                    onMouseEnter={() => setShowUserMenu(true)}
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="px-4 py-2 font-medium text-gray-900 border-b border-gray-100">
                      {user.name}
                    </div>
                    <Link
                      to="/profile"
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Thông tin cá nhân
                    </Link>
                    <Link
                      to="/orders"
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Đơn hàng
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="py-1 px-3 text-sm bg-primary h-9 text-white  rounded-lg 
              flex items-center hover:bg-primary-dark transition-colors"
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

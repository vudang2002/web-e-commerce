import {
  FiSearch,
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const AdminHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  return (
    <header
      className="bg-white px-6 py-4 border-b flex justify-end items-center 
    gap-4"
    >
      {/* Search icon */}
      <button className="text-gray-700 hover:text-black">
        <FiSearch size={20} />
      </button>

      {/* Notification icon */}
      <button className="text-gray-700 hover:text-black">
        <FiBell size={20} />
      </button>

      {/* Admin Dropdown */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-1.5 border rounded text-sm font-medium hover:bg-gray-100"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {user?.name || "ADMIN"}
          <FiChevronDown size={16} />
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
            <button
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => setDropdownOpen(false)}
            >
              <FiUser className="mr-2" />
              Profile
            </button>
            <button
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => setDropdownOpen(false)}
            >
              <FiSettings className="mr-2" />
              Settings
            </button>
            <hr className="my-1" />
            <button
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              onClick={handleLogout}
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;

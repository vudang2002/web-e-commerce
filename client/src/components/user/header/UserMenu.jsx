import { Link } from "react-router-dom";
import { useState } from "react";

export default function UserMenu({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 border border-gray-300 rounded-full p-2
         "
      >
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-8 h-8 rounded-full"
        />
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded">
          <p className="px-4 py-2">{user.name}</p>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Log out
          </button>
          <Link
            to="/orders"
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Order
          </Link>
        </div>
      )}
    </div>
  );
}

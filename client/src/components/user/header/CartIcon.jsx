import { CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useCartStats } from "../../../hooks/useCart";
import { useAuth } from "../../../contexts/AuthContext";

const CartIcon = () => {
  const { user } = useAuth();
  const { totalItems } = useCartStats();

  // Chỉ hiển thị số lượng khi user đã đăng nhập
  const displayTotalItems = user ? totalItems : 0;

  return (
    <Link to="/cart" className="text-xl relative" aria-label="Cart">
      <CiShoppingCart size={24} className="text-primary" />
      {displayTotalItems > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center">
          {displayTotalItems > 99 ? "99+" : displayTotalItems}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;

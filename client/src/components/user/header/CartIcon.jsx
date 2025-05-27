import { CiShoppingCart } from "react-icons/ci";
const CartIcon = () => {
  return (
    <button className="text-xl relative" aria-label="Cart">
      <CiShoppingCart size={24} className="text-primary" />
      {/* <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs px-1 rounded-full">3</span> */}
    </button>
  );
};

export default CartIcon;

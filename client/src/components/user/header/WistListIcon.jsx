import { CiHeart } from "react-icons/ci";
const WishlistIcon = () => {
  return (
    <button className="text-xl relative" aria-label="Wishlist">
      <CiHeart size={24} className="text-red-500" />
      {/* Ví dụ: số lượng sản phẩm yêu thích */}
      {/* <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">2</span> */}
    </button>
  );
};

export default WishlistIcon;

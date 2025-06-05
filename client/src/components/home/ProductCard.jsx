import { Link } from "react-router-dom";
import AddToCartButton from "../cart/AddToCartButton";

const ProductCard = ({ id, image, title, price, sold, discount, badge }) => {
  return (
    <div className="relative group hover:shadow-lg transition duration-300 hover:scale-105 overflow-hidden">
      <Link
        to={id ? `/product/${id}` : "#"}
        className="text-inherit no-underline block"
      >
        <div
          className="group bg-white rounded hover:rounded-b-none shadow-sm border p-2 hover:shadow-md transition
       hover:border-red-500 relative flex flex-col justify-between"
          style={{ minHeight: "250px" }}
        >
          <div>
            <div className="relative">
              <img
                src={
                  image.length > 0 ? image[0] : "/images/products/manhinh.png"
                }
                alt={title}
                className="w-full h-40 object-cover rounded"
              />
              {discount && discount > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                  -{discount}%
                </span>
              )}
              {badge && (
                <span className="absolute bottom-2 left-2 bg-orange-400 text-white text-xs px-1 py-0.5 rounded">
                  {badge}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm font-medium line-clamp-2">{title}</p>
            <p className="text-red-500 font-bold mt-1 text-sm">
              ₫{price.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Đã bán {sold}</p>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button - appears on hover */}
      <div
        className="group-hover:block hidden absolute bottom-0 left-0 w-full z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <AddToCartButton
          productId={id}
          quantity={1}
          size="small"
          variant="red"
          className="w-full rounded-none rounded-b text-xs py-2"
          showIcon={false}
        >
          Thêm vào giỏ hàng
        </AddToCartButton>
      </div>
    </div>
  );
};

export default ProductCard;

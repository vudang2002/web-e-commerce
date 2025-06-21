import React from "react";
import { Link } from "react-router-dom";
import { useCartStats } from "../../../hooks/useCart";
import ProductPrice from "../../common/ProductPrice";

const CartPreview = () => {
  const { cartItems, totalItems } = useCartStats();
  // Lấy tối đa 5 sản phẩm mới nhất
  const previewItems = [...cartItems].slice(-5).reverse();

  return (
    <div
      className="absolute right-0 top-full  w-80 bg-white shadow-lg rounded-lg 
      border border-gray-200 z-50 p-4 min-h-[150px] hidden group-hover:flex group-focus-within:flex 
      flex-col pointer-events-auto"
      tabIndex={-1}
    >
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
        {previewItems.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Chưa có sản phẩm nào
          </div>
        ) : (
          previewItems.map((item) => (
            <div
              key={item._id || item.product._id}
              className="flex items-center gap-3 py-2"
            >
              <img
                src={item.product.images?.[0] || "/images/placeholder.jpg"}
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded border"
              />{" "}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {item.product.name}
                </div>
                <div className="text-xs mt-1">
                  <ProductPrice
                    product={item.product}
                    size="sm"
                    showDiscount={false}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 ml-2">x{item.quantity}</div>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center justify-between mt-4 gap-2">
        <span className="ml-2 text-xs text-gray-600 whitespace-nowrap">
          {totalItems} sản phẩm
        </span>
        <Link
          to="/cart"
          className="flex-1 bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700 text-center font-semibold"
        >
          Xem giỏ hàng
        </Link>
      </div>
    </div>
  );
};

export default CartPreview;

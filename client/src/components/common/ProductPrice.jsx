import React from "react";
import { formatProductPrice } from "../../utils/formatters";

const ProductPrice = ({
  product,
  className = "",
  showDiscount = true,
  size = "md",
}) => {
  const priceInfo = formatProductPrice(product);

  // Size classes
  const sizeClasses = {
    sm: {
      originalPrice: "text-sm",
      discountedPrice: "text-sm font-semibold",
      discount: "text-xs",
    },
    md: {
      originalPrice: "text-base",
      discountedPrice: "text-lg font-bold",
      discount: "text-sm",
    },
    lg: {
      originalPrice: "text-lg",
      discountedPrice: "text-xl font-bold",
      discount: "text-base",
    },
  };

  const sizes = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {priceInfo.isOnSale ? (
        <>
          {/* Giá sau giảm */}
          <span className={`text-red-600 ${sizes.discountedPrice}`}>
            {priceInfo.formattedDiscountedPrice}
          </span>

          {/* Giá gốc bị gạch */}
          <span className={`text-gray-500 line-through ${sizes.originalPrice}`}>
            {priceInfo.formattedOriginalPrice}
          </span>

          {/* Phần trăm giảm giá */}
          {showDiscount && (
            <span
              className={`bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium ${sizes.discount}`}
            >
              -{priceInfo.discount}%
            </span>
          )}
        </>
      ) : (
        /* Không có giảm giá */
        <span className={`text-gray-900 ${sizes.discountedPrice}`}>
          {priceInfo.formattedOriginalPrice}
        </span>
      )}
    </div>
  );
};

export default ProductPrice;

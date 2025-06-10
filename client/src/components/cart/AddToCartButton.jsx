import React, { useState } from "react";
import { useAddToCart } from "../../hooks/useCart";
import { useAuth } from "../../contexts/AuthContext";
import { CiShoppingCart } from "react-icons/ci";

const AddToCartButton = ({
  productId,
  quantity = 1,
  className = "",
  size = "medium",
  variant = "primary",
  disabled = false,
  showIcon = true,
  children,
}) => {
  const { user } = useAuth();
  const addToCartMutation = useAddToCart();
  const [isHovering, setIsHovering] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    if (!productId) {
      console.error("Product ID is required");
      return;
    }

    addToCartMutation.mutate({
      productId,
      quantity,
    });
  };

  // Size classes
  const sizeClasses = {
    small: "px-3 py-1 text-xs",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    red: "bg-red-600 hover:bg-red-700 text-white",
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium rounded-lg
    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  `;

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim();

  const isLoading = addToCartMutation.isLoading;

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
      className={buttonClasses}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label={children ? undefined : "Thêm vào giỏ hàng"}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          <span>Đang thêm...</span>
        </>
      ) : (
        <>
          {showIcon && (
            <CiShoppingCart
              size={size === "small" ? 16 : size === "large" ? 24 : 20}
              className={isHovering ? "animate-bounce" : ""}
            />
          )}
          {children || "Thêm vào giỏ hàng"}
        </>
      )}
    </button>
  );
};

export default AddToCartButton;

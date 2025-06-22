import React from "react";
import { FiX, FiShoppingCart, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductSuggestion = ({ products, onClear }) => {
  const navigate = useNavigate();

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
    onClear(); // Clear suggestions after navigating
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex items-center">
          <FiShoppingCart size={16} className="mr-2" />
          Sản phẩm gợi ý
        </h4>
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Đóng gợi ý"
        >
          <FiX size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handleViewProduct(product.id)}
          >
            {/* Product Image */}
            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {product.images ? (
                <img
                  src={product.images}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.classList.add(
                      "flex",
                      "items-center",
                      "justify-center"
                    );
                    e.target.parentNode.innerHTML =
                      '<span class="text-xs text-gray-400">No img</span>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-gray-400">No img</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-sm text-gray-800 truncate">
                {product.name}
              </h5>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-semibold text-blue-600">
                  {formatPrice(product.finalPrice || product.price)}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {product.brand} • {product.category}
                </span>
                {product.rating > 0 && (
                  <span className="text-xs text-yellow-600">
                    ⭐ {product.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>

            {/* View Button */}
            <button
              className="flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors p-1"
              aria-label="Xem sản phẩm"
            >
              <FiEye size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t">
        <p className="text-xs text-gray-500 text-center">
          Nhấp vào sản phẩm để xem chi tiết
        </p>
      </div>
    </div>
  );
};

export default ProductSuggestion;

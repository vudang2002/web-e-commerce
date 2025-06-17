import React, { useState } from "react";
import { useUpdateCartItem, useRemoveCartItem } from "../../hooks/useCart";
import ProductPrice from "../common/ProductPrice";
import { calculateDiscountedPrice } from "../../utils/formatters";
import ConfirmModal from "../common/ConfirmModal";

export default function CartItem({ item }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();

  const product = item.product;

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 1) return;

    setQuantity(newQuantity);
    updateCartItemMutation.mutate({
      productId: product._id,
      quantity: newQuantity,
    });
  };
  const handleRemoveItem = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmRemove = () => {
    removeCartItemMutation.mutate(product._id);
    setShowConfirmModal(false);
  };

  const handleCancelRemove = () => {
    setShowConfirmModal(false);
  };

  const handleIncrease = () => {
    handleUpdateQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      handleUpdateQuantity(quantity - 1);
    }
  };
  const productImage = product.images?.[0] || "/images/placeholder.jpg";
  const discountedPrice = calculateDiscountedPrice(
    product.price || 0,
    product.discount || 0
  );
  const totalPrice = discountedPrice * quantity;

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={productImage}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.target.src = "/images/placeholder.jpg";
            }}
          />
        </div>
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Thương hiệu: {product.brand?.name || "Không xác định"}
          </p>
          <p className="text-sm text-gray-500">
            Danh mục: {product.category?.name || "Không xác định"}
          </p>
        </div>
        {/* Price */}
        <div className="text-right">
          <ProductPrice product={product} size="sm" showDiscount={true} />
        </div>
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1 || updateCartItemMutation.isLoading}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="w-12 text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={updateCartItemMutation.isLoading}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>{" "}
        {/* Total Price */}
        <div className="text-right min-w-0">
          <p className="text-sm font-semibold text-red-600">
            {totalPrice.toLocaleString("vi-VN")}đ
          </p>
        </div>
        {/* Remove Button */}
        <div className="flex-shrink-0">
          <button
            onClick={handleRemoveItem}
            disabled={removeCartItemMutation.isLoading}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {removeCartItemMutation.isLoading ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>{" "}
      {/* Loading overlay */}
      {(updateCartItemMutation.isLoading ||
        removeCartItemMutation.isLoading) && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa "${product.name}" khỏi giỏ hàng không?`}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </div>
  );
}

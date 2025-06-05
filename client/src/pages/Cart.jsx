import React, { useState } from "react";
import CartItem from "../components/cart/CartItem";
import { useCart, useCartStats, useClearCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import ConfirmModal from "../components/common/ConfirmModal";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const { user } = useAuth();
  const { isLoading, error } = useCart();
  const { cartItems, totalItems, totalPrice, isEmpty } = useCartStats();
  const clearCartMutation = useClearCart();
  const navigate = useNavigate();
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  // Debug: Log cart data
  console.log("Cart.jsx - cartItems:", cartItems);
  console.log("Cart.jsx - totalItems:", totalItems);
  console.log("Cart.jsx - isEmpty:", isEmpty);
  console.log("Cart.jsx - user:", user);

  // Nếu user chưa đăng nhập
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vui lòng đăng nhập
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn cần đăng nhập để xem giỏ hàng của mình.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tải giỏ hàng...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 mb-4">
              Không thể tải giỏ hàng. Vui lòng thử lại sau.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2 8m2-8h10m-8 3v6m4-6v6"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }
  const handleClearCart = async () => {
    setShowClearCartModal(true);
  };

  const handleConfirmClearCart = () => {
    clearCartMutation.mutate();
    setShowClearCartModal(false);
  };

  const handleCancelClearCart = () => {
    setShowClearCartModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
          <p className="text-gray-600">
            Bạn có {totalItems} sản phẩm trong giỏ hàng
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Sản phẩm ({cartItems.length})
                </h2>
                <button
                  onClick={handleClearCart}
                  disabled={clearCartMutation.isLoading}
                  className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                >
                  {clearCartMutation.isLoading ? "Đang xóa..." : "Xóa tất cả"}
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="text-gray-900">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-gray-900">Miễn phí</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      Tổng cộng:
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {totalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </div>{" "}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors mb-3"
              >
                Tiến hành thanh toán
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>{" "}
          </div>
        </div>{" "}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Confirm Modal for Clear Cart */}
      <ConfirmModal
        isOpen={showClearCartModal}
        title="Xác nhận xóa toàn bộ giỏ hàng"
        message="Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng không? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmClearCart}
        onCancel={handleCancelClearCart}
      />
    </div>
  );
}

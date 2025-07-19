import React from "react";
import CartTable from "../components/cart/CartTable";
import CartSummary from "../components/cart/CartSummary";
import { ToastContainer } from "react-toastify";
import Breadcrumb from "../components/common/Breadcrumb";
import ConfirmModal from "../components/common/ConfirmModal";
import "react-toastify/dist/ReactToastify.css";
import { useCartPageLogic } from "../hooks/useCartPageLogic";

export default function Cart() {
  const {
    // State
    user,
    isLoading,
    error,
    isEmpty,
    cartItems,
    selectedItems,
    showClearCartModal,
    showDeleteItemModal,

    // Computed values
    allSelected,
    // selectedCartItems không được sử dụng trực tiếp trong component này
    selectedTotalPrice,
    selectedTotalItems,

    // Mutations
    clearCartMutation,

    // Event handlers
    handleClearCart,
    handleConfirmClearCart,
    handleCancelClearCart,
    handleSelectAll,
    handleSelectItem,
    handleUpdateQuantity,
    handleRemoveItem,
    handleConfirmDeleteItem,
    handleCancelDeleteItem,
    handleCheckout,
  } = useCartPageLogic();

  // Không cần định nghĩa navigate vì nó đã được xử lý trong hook

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
                onClick={() => (window.location.href = "/")}
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
              onClick={() => (window.location.href = "/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <h2 className="text-center text-lg font-bold uppercase  pb-2 mx-auto mt-4 text-red-600">
        Giỏ hàng của bạn
      </h2>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cart Table */}
          <CartTable
            cartItems={cartItems}
            selectedItems={selectedItems}
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />

          {/* Cart Summary */}
          <CartSummary
            cartItems={cartItems}
            selectedItems={selectedItems}
            selectedTotalItems={selectedTotalItems}
            selectedTotalPrice={selectedTotalPrice}
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
            clearCartLoading={clearCartMutation.isLoading}
          />
        </div>
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

      {/* Confirm Modal for Delete Single Item */}
      <ConfirmModal
        isOpen={showDeleteItemModal}
        title="Xác nhận xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
        onConfirm={handleConfirmDeleteItem}
        onCancel={handleCancelDeleteItem}
      />
    </div>
  );
}

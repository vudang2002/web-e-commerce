import React, { useState, useMemo, useCallback } from "react";
import CartTable from "../components/cart/CartTable";
import CartSummary from "../components/cart/CartSummary";
import {
  useCart,
  useCartStats,
  useClearCart,
  useUpdateCartItem,
  useRemoveCartItem,
} from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import Breadcrumb from "../components/common/Breadcrumb";
import ConfirmModal from "../components/common/ConfirmModal";
import { calculateSelectedData, logger } from "../utils/cartUtils";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const { user } = useAuth();
  const { isLoading, error } = useCart();
  const { cartItems, totalItems, isEmpty } = useCartStats();
  const clearCartMutation = useClearCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();
  const navigate = useNavigate();
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // Computed values using useMemo
  const allSelected = useMemo(
    () => cartItems.length > 0 && selectedItems.length === cartItems.length,
    [cartItems.length, selectedItems.length]
  );

  const selectedData = useMemo(
    () => calculateSelectedData(cartItems, selectedItems),
    [cartItems, selectedItems]
  );

  const { selectedCartItems, selectedTotalPrice, selectedTotalItems } = selectedData;

  // Debug logs with condition
  logger.log("Cart.jsx - cartItems:", cartItems);
  logger.log("Cart.jsx - totalItems:", totalItems);
  logger.log("Cart.jsx - isEmpty:", isEmpty);
  logger.log("Cart.jsx - user:", user);

  // Event handlers with useCallback
  const handleClearCart = useCallback(() => {
    setShowClearCartModal(true);
  }, []);

  const handleConfirmClearCart = useCallback(() => {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Đã xóa toàn bộ giỏ hàng!");
        setSelectedItems([]);
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi xóa giỏ hàng: " + error.message);
      }
    });
    setShowClearCartModal(false);
  }, [clearCartMutation]);

  const handleCancelClearCart = useCallback(() => {
    setShowClearCartModal(false);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item._id));
    }
  }, [allSelected, cartItems]);

  const handleSelectItem = useCallback((id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  }, []);

  const handleUpdateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) {
      // Nếu số lượng < 1, hiển thị modal xác nhận xóa
      setItemToDelete(productId);
      setShowDeleteItemModal(true);
      return;
    }
    updateCartItemMutation.mutate(
      {
        productId,
        quantity: newQuantity,
      },
      {
        onSuccess: () => {
          toast.success("Đã cập nhật số lượng!");
        },
        onError: (error) => {
          toast.error("Có lỗi xảy ra: " + error.message);
        }
      }
    );
  }, [updateCartItemMutation]);

  const handleRemoveItem = useCallback((productId) => {
    setItemToDelete(productId);
    setShowDeleteItemModal(true);
  }, []);

  const handleConfirmDeleteItem = useCallback(() => {
    if (itemToDelete) {
      removeCartItemMutation.mutate(itemToDelete, {
        onSuccess: () => {
          toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
          setSelectedItems(prev => prev.filter(id => id !== itemToDelete));
        },
        onError: (error) => {
          toast.error("Có lỗi xảy ra khi xóa sản phẩm: " + error.message);
        }
      });
      setItemToDelete(null);
    }
    setShowDeleteItemModal(false);
  }, [itemToDelete, removeCartItemMutation]);

  const handleCancelDeleteItem = useCallback(() => {
    setItemToDelete(null);
    setShowDeleteItemModal(false);
  }, []);

  const handleCheckout = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để mua hàng!");
      return;
    }

    // Lưu thông tin sản phẩm đã chọn vào sessionStorage
    const selectedCheckoutData = {
      items: selectedCartItems,
      totalPrice: selectedTotalPrice,
      totalItems: selectedTotalItems,
      isFromCart: true, // Đánh dấu là từ cart (khác với buyNow)
    };

    sessionStorage.setItem(
      "checkoutData",
      JSON.stringify(selectedCheckoutData)
    );
    navigate("/checkout");
  }, [selectedItems.length, selectedCartItems, selectedTotalPrice, selectedTotalItems, navigate]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Giỏ hàng", path: "/cart" }]} />
      
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

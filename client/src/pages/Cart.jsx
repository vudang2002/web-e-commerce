import React, { useState } from "react";
import CartItem from "../components/cart/CartItem";
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
import ConfirmModal from "../components/common/ConfirmModal";
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
  const allSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;

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

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item._id));
    }
  };
  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // Nếu số lượng < 1, hiển thị modal xác nhận xóa
      setItemToDelete(productId);
      setShowDeleteItemModal(true);
      return;
    }
    updateCartItemMutation.mutate({
      productId,
      quantity: newQuantity,
    });
  };
  const handleRemoveItem = (productId) => {
    setItemToDelete(productId);
    setShowDeleteItemModal(true);
  };
  const handleConfirmDeleteItem = () => {
    if (itemToDelete) {
      removeCartItemMutation.mutate(itemToDelete);
      setItemToDelete(null);
    }
    setShowDeleteItemModal(false);
  };

  const handleCancelDeleteItem = () => {
    setItemToDelete(null);
    setShowDeleteItemModal(false);
  };

  const handleCheckout = () => {
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
  };

  // Tính tổng tiền của các sản phẩm đã chọn
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item._id)
  );
  const selectedTotalPrice = selectedCartItems.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
  const selectedTotalItems = selectedCartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3 text-left">Sản phẩm</th>
                    <th className="px-4 py-3 text-center">Đơn giá</th>
                    <th className="px-4 py-3 text-center">Số lượng</th>
                    <th className="px-4 py-3 text-center">Số tiền</th>
                    <th className="px-4 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cartItems.map((item) => {
                    const product = item.product;
                    const productImage =
                      product.images?.[0] || "/images/placeholder.jpg";
                    const productPrice = product.price || 0;
                    const totalPrice = productPrice * item.quantity;
                    return (
                      <tr key={item._id} className="align-middle">
                        <td className="px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => handleSelectItem(item._id)}
                          />
                        </td>
                        <td className="px-4 py-4 flex items-center gap-3 min-w-[220px]">
                          <img
                            src={productImage}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-2">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Phân loại: {product.category?.name || "-"}
                            </div>
                            <div className="text-xs text-gray-500">
                              Thương hiệu: {product.brand?.name || "-"}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-red-600 font-semibold">
                            {productPrice.toLocaleString("vi-VN")}đ
                          </span>
                        </td>{" "}
                        <td className="px-4 py-4 text-center">
                          <div className="inline-flex items-center border rounded overflow-hidden">
                            {" "}
                            <button
                              className="w-8 h-8 flex items-center justify-center border-r border-gray-200 bg-gray-50 hover:bg-gray-100"
                              onClick={() =>
                                handleUpdateQuantity(
                                  product._id,
                                  item.quantity - 1
                                )
                              }
                            >
                              -
                            </button>
                            <span className="w-10 text-center">
                              {item.quantity}
                            </span>
                            <button
                              className="w-8 h-8 flex items-center justify-center border-l border-gray-200 bg-gray-50 hover:bg-gray-100"
                              onClick={() =>
                                handleUpdateQuantity(
                                  product._id,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-red-600 font-semibold">
                            {totalPrice.toLocaleString("vi-VN")}đ
                          </span>
                        </td>{" "}
                        <td className="px-4 py-4 text-center">
                          {" "}
                          <button
                            className="text-red-600 hover:underline text-xs mr-2"
                            onClick={() => handleRemoveItem(product._id)}
                          >
                            Xóa
                          </button>
                          <button className="text-blue-600 hover:underline text-xs">
                            Tìm sản phẩm tương tự
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>{" "}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {" "}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="mr-1"
              />
              <span className="text-gray-600 text-sm">
                Chọn Tất Cả ({cartItems.length})
              </span>
              <span className="text-gray-500 text-xs">
                - Đã chọn: {selectedItems.length}
              </span>
              <button
                onClick={handleClearCart}
                disabled={clearCartMutation.isLoading}
                className="text-red-600 hover:text-red-700 text-xs font-medium disabled:opacity-50 ml-2"
              >
                {clearCartMutation.isLoading ? "Đang xóa..." : "Xóa tất cả"}
              </button>
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-end gap-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Shopee Voucher</span>
                <input
                  type="text"
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="Nhập mã giảm giá"
                />
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Áp dụng
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">
                  Tổng cộng ({selectedTotalItems} sản phẩm):
                </span>
                <span className="text-lg font-bold text-red-600">
                  {selectedTotalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>{" "}
              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="bg-red-600 text-white px-6 py-3 rounded font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Mua Hàng ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />{" "}
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

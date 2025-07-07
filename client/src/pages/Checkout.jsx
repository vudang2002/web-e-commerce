import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  useCartStats,
  useClearCart,
  useRemoveCartItem,
} from "../hooks/useCart";
import { useCreateOrder } from "../hooks/useOrder";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, totalPrice, isEmpty } = useCartStats();
  const clearCartMutation = useClearCart();
  const removeCartItemMutation = useRemoveCartItem();
  const createOrderMutation = useCreateOrder();
  // Check for Buy Now data in sessionStorage
  const buyNowData = React.useMemo(() => {
    const stored = sessionStorage.getItem("buyNowData");
    return stored ? JSON.parse(stored) : null;
  }, []);

  // Check for Cart Checkout data in sessionStorage
  const cartCheckoutData = React.useMemo(() => {
    const stored = sessionStorage.getItem("checkoutData");
    return stored ? JSON.parse(stored) : null;
  }, []);

  // Use priority: Cart Checkout > Buy Now > Cart data
  const checkoutItems =
    cartCheckoutData?.items || buyNowData?.items || cartItems;
  const checkoutTotal =
    cartCheckoutData?.totalPrice || buyNowData?.totalPrice || totalPrice;
  const isCheckoutEmpty = cartCheckoutData
    ? checkoutItems.length === 0
    : buyNowData
    ? checkoutItems.length === 0
    : isEmpty;

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    shippingAddress: "",
    phoneNo: "",
    paymentMethod: "COD",
    voucherCode: "",
  });
  // Redirect if not logged in or cart is empty
  React.useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (isCheckoutEmpty) {
      navigate("/cart");
      return;
    }
  }, [user, isCheckoutEmpty, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.shippingAddress.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    if (!formData.phoneNo.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    try {
      // Prepare order data
      const orderData = {
        items: checkoutItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: formData.shippingAddress,
        phoneNo: formData.phoneNo,
        paymentMethod: formData.paymentMethod,
        voucherCode: formData.voucherCode || undefined,
      };

      // Create order using the mutation
      const result = await createOrderMutation.mutateAsync(orderData);
      if (result.success) {
        // Clear sessionStorage based on the source
        if (cartCheckoutData) {
          // Clear checkout data and remove purchased items from cart
          sessionStorage.removeItem("checkoutData");
          // Remove each purchased item from cart
          cartCheckoutData.items.forEach((item) => {
            removeCartItemMutation.mutate(item.product._id);
          });
        } else if (buyNowData) {
          sessionStorage.removeItem("buyNowData");
        } else {
          // Clear cart after successful order if it was from cart
          clearCartMutation.mutate();
        }

        // Redirect to order success page or orders list
        setTimeout(() => {
          navigate("/orders");
        }, 2000);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      // Error is already handled by the mutation hook
    }
  };
  const SHIPPING_FEE = 12800; // 12,800đ shipping fee

  if (!user || isCheckoutEmpty) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Delivery Address Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="text-red-500 mr-2">📍</div>
            <h2 className="text-lg font-semibold text-gray-900">
              Địa Chỉ Nhận Hàng
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ tên *
              </label>
              <input
                type="text"
                name="fullName"
                value={user?.name || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại *
              </label>
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(+84) 969279028"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ giao hàng *
              </label>
              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Địa chỉ giao hàng của bạn"
                required
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-end">
              <button className="text-blue-600 text-sm hover:underline">
                Thay Đổi
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h2>
          <div className="space-y-4">
            {checkoutItems.map((item) => (
              <div
                key={item._id || `${item.product._id}-${item.quantity}`}
                className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <img
                  src={item.product.images?.[0] || "/images/placeholder.jpg"}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md border border-gray-200"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    Loại: {item.product.category?.name || "KNJ - Đen"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Đơn giá:{" "}
                      {(item.product.price || 0).toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-sm text-gray-600">
                      Số lượng: {item.quantity}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      Thành tiền:{" "}
                      {(
                        (item.product.price || 0) * item.quantity
                      ).toLocaleString("vi-VN")}
                      đ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Phương thức thanh toán
          </h2>

          {/* Payment Options */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={formData.paymentMethod === "COD"}
                onChange={handleInputChange}
                className="mr-3 text-blue-600"
              />
              <span className="text-sm">Thanh toán khi nhận hàng</span>
              <span className="ml-auto text-blue-600 text-sm font-medium">
                THAY ĐỔI
              </span>
            </label>
          </div>

          {/* Insurance Option */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <div>
                  <p className="text-sm font-medium">Bảo hiểm Thời trang</p>
                  <p className="text-xs text-gray-500">
                    Bảo vệ sản phẩm được bảo hiểm khỏi thiệt hại do có bất ngờ,
                    tiếp xúc với chất lỏng hoặc hư hỏng trong quá trình sử dụng.{" "}
                    <span className="text-blue-600 cursor-pointer">
                      Tìm hiểu thêm
                    </span>
                  </p>
                </div>
              </div>
              <span className="text-sm">₫579</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Tổng tiền hàng</span>
                <span>₫{checkoutTotal.toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tổng tiền phí vận chuyển</span>
                <span>₫{SHIPPING_FEE.toLocaleString("vi-VN")}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold text-red-600 mb-6">
              <span>Tổng thanh toán</span>
              <span>
                ₫{(checkoutTotal + SHIPPING_FEE).toLocaleString("vi-VN")}
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-4">
                <input type="checkbox" required className="mr-2" />
                <span className="text-sm text-gray-600">
                  Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{" "}
                  <span className="text-blue-600 cursor-pointer">
                    Điều khoản Shopee
                  </span>
                </span>
              </div>

              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full bg-red-500 text-white py-3 px-4 rounded-md font-medium hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {createOrderMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đặt hàng"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

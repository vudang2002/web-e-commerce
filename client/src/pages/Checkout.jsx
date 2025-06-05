import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCartStats, useClearCart } from "../hooks/useCart";
import { useCreateOrder } from "../hooks/useOrder";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, totalPrice, isEmpty } = useCartStats();
  const clearCartMutation = useClearCart();
  const createOrderMutation = useCreateOrder();

  // Check for Buy Now data in sessionStorage
  const buyNowData = React.useMemo(() => {
    const stored = sessionStorage.getItem("buyNowData");
    return stored ? JSON.parse(stored) : null;
  }, []);

  // Use Buy Now data if available, otherwise use cart data
  const checkoutItems = buyNowData?.items || cartItems;
  const checkoutTotal = buyNowData?.totalPrice || totalPrice;
  const isCheckoutEmpty = buyNowData ? checkoutItems.length === 0 : isEmpty;

  const [formData, setFormData] = useState({
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
        shippingAddress: {
          address: formData.shippingAddress,
          phoneNumber: formData.phoneNo,
          fullName: user.name || "Customer",
        },
        paymentMethod: formData.paymentMethod,
        voucherCode: formData.voucherCode || undefined,
      };

      // Create order using the mutation
      const result = await createOrderMutation.mutateAsync(orderData);

      if (result.success) {
        // Clear sessionStorage if it was a Buy Now order
        if (buyNowData) {
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
  const shippingFee = 0; // Free shipping
  const finalTotal = checkoutTotal + shippingFee;

  if (!user || isCheckoutEmpty) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600">Hoàn tất thông tin để đặt hàng</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Thông tin giao hàng
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ giao hàng *
                </label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập địa chỉ chi tiết của bạn"
                  required
                />
              </div>
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={formData.paymentMethod === "Online"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Thanh toán online</span>
                  </label>
                </div>
              </div>
              {/* Voucher Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã giảm giá (tùy chọn)
                </label>
                <input
                  type="text"
                  name="voucherCode"
                  value={formData.voucherCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mã giảm giá"
                />
              </div>{" "}
              {/* Submit Button */}
              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Đơn hàng của bạn
            </h2>{" "}
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {checkoutItems.map((item) => (
                <div
                  key={item._id || `${item.product._id}-${item.quantity}`}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={item.product.images?.[0] || "/images/placeholder.jpg"}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {((item.product.price || 0) * item.quantity).toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </div>
                </div>
              ))}
            </div>
            {/* Order Total */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              {" "}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="text-gray-900">
                  {checkoutTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="text-gray-900">
                  {shippingFee === 0
                    ? "Miễn phí"
                    : `${shippingFee.toLocaleString("vi-VN")}đ`}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">
                    Tổng cộng:
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {finalTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

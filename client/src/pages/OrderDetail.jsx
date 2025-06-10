import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useOrderById, useCancelOrder } from "../hooks/useOrder";
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCheck,
  FiX,
  FiClock,
  FiMapPin,
  FiPhone,
  FiCreditCard,
} from "react-icons/fi";
import { toast } from "react-toastify";

const OrderStatusIcon = ({ status }) => {
  const iconProps = { size: 20, className: "inline" };

  switch (status?.toLowerCase()) {
    case "pending":
      return <FiClock {...iconProps} className="text-yellow-500" />;
    case "confirmed":
      return <FiPackage {...iconProps} className="text-blue-500" />;
    case "shipped":
      return <FiTruck {...iconProps} className="text-purple-500" />;
    case "delivered":
      return <FiCheck {...iconProps} className="text-green-500" />;
    case "cancelled":
      return <FiX {...iconProps} className="text-red-500" />;
    default:
      return <FiClock {...iconProps} className="text-gray-500" />;
  }
};

const OrderStatusBadge = ({ status, size = "md" }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const sizeClasses =
    size === "lg" ? "px-4 py-2 text-base" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-2 ${sizeClasses} rounded-full font-medium border ${getStatusColor(
        status
      )}`}
    >
      <OrderStatusIcon status={status} />
      {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
    </span>
  );
};

const OrderTimeline = ({ order }) => {
  const getTimelineStatus = () => {
    const status = order.status?.toLowerCase();
    const timeline = [
      { key: "pending", label: "Order Placed", icon: FiClock, active: true },
      {
        key: "confirmed",
        label: "Order Confirmed",
        icon: FiPackage,
        active: false,
      },
      { key: "shipped", label: "Shipped", icon: FiTruck, active: false },
      { key: "delivered", label: "Delivered", icon: FiCheck, active: false },
    ];

    let currentIndex = timeline.findIndex((item) => item.key === status);
    if (currentIndex === -1) currentIndex = 0;

    return timeline.map((item, index) => ({
      ...item,
      active: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  const timelineItems = getTimelineStatus();
  const isCancelled = order.status?.toLowerCase() === "cancelled";

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
          <FiX size={20} />
          <span className="font-medium">Order Cancelled</span>
        </div>
        <p className="text-sm text-red-600 mt-1">
          This order has been cancelled on{" "}
          {new Date(order.updatedAt).toLocaleDateString("vi-VN")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Order Timeline
      </h3>
      <div className="space-y-4">
        {timelineItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  item.active
                    ? item.current
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-green-600 border-green-600 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    item.active ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </p>
                {item.current && (
                  <p className="text-sm text-blue-600">Current status</p>
                )}
              </div>
              {index < timelineItems.length - 1 && (
                <div
                  className={`absolute left-5 mt-10 w-0.5 h-6 ${
                    item.active ? "bg-green-600" : "bg-gray-300"
                  }`}
                  style={{ marginLeft: "20px" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cancelOrderMutation = useCancelOrder();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      toast.error("Please log in to view your orders");
      navigate("/login");
    }
  }, [user, navigate]);

  const { data, isLoading, error, refetch } = useOrderById(orderId);
  const order = data?.data;

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrderMutation.mutateAsync(orderId);
        refetch(); // Refresh order data
      } catch {
        // Error is handled by the mutation hook
      }
    }
  };

  if (!user) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <FiX size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load order
          </h2>
          <p className="text-gray-600 mb-4">
            {error.response?.data?.message || "Something went wrong"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-3"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order not found
          </h2>
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const canCancelOrder = order.status?.toLowerCase() === "pending";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft size={20} />
            Back to Orders
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order._id?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} size="lg" />
              {canCancelOrder && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelOrderMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiX size={16} />
                  {cancelOrderMutation.isPending
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={
                        item.product?.images?.[0] || "/images/placeholder.jpg"
                      }
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {item.product?.name || "Product Unavailable"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.quantity * item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <OrderTimeline order={order} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.totalAmount - (order.shippingFee || 0))}
                  </span>
                </div>
                {order.shippingFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.shippingFee)}
                    </span>
                  </div>
                )}
                {order.voucherDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>
                      -
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.voucherDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t font-semibold text-lg">
                  <span>Total:</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-gray-400 mt-1" size={16} />
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress?.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.ward},{" "}
                      {order.shippingAddress?.district}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.province}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-gray-400" size={16} />
                  <span className="text-sm text-gray-600">
                    {order.shippingAddress?.phoneNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h3>
              <div className="flex items-center gap-3">
                <FiCreditCard className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600 capitalize">
                  {order.paymentMethod || "Cash on Delivery"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

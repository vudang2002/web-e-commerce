import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUserOrders, useCancelOrder } from "../hooks/useOrder";
import {
  FiPackage,
  FiTruck,
  FiCheck,
  FiX,
  FiEye,
  FiClock,
} from "react-icons/fi";
import { toast } from "react-toastify";

const OrderStatusIcon = ({ status }) => {
  const iconProps = { size: 16, className: "inline" };

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

const OrderStatusBadge = ({ status }) => {
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

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
        status
      )}`}
    >
      <OrderStatusIcon status={status} />
      {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
    </span>
  );
};

const OrderItem = ({ item }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
    <img
      src={item.product?.images?.[0] || "/images/placeholder.jpg"}
      alt={item.product?.name}
      className="w-12 h-12 object-cover rounded-md"
    />
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-gray-900 truncate">
        {item.product?.name || "Product Unavailable"}
      </h4>
      <p className="text-xs text-gray-500">
        Quantity: {item.quantity} ×{" "}
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item.price)}
      </p>
    </div>
    <div className="text-sm font-medium text-gray-900">
      {new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(item.quantity * item.price)}
    </div>
  </div>
);

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const cancelOrderMutation = useCancelOrder();

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrderMutation.mutateAsync(orderId);
      } catch {
        // Error is handled by the mutation hook
      }
    }
  };

  const canCancelOrder = order.status?.toLowerCase() === "pending";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{order._id?.slice(-8).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.items?.map((item, index) => (
          <OrderItem key={index} item={item} />
        ))}
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Subtotal:</span>
          <span className="text-sm">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(order.totalAmount - (order.shippingFee || 0))}
          </span>
        </div>
        {order.shippingFee > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Shipping:</span>
            <span className="text-sm">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.shippingFee)}
            </span>
          </div>
        )}
        {order.voucherDiscount > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-green-600">Discount:</span>
            <span className="text-sm text-green-600">
              -
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.voucherDiscount)}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-semibold text-gray-900">Total:</span>
          <span className="font-semibold text-lg text-gray-900">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(order.totalAmount)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4 pt-4 border-t">
        <button
          onClick={() => navigate(`/orders/${order._id}`)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
        >
          <FiEye size={16} />
          View Details
        </button>
        {canCancelOrder && (
          <button
            onClick={() => handleCancelOrder(order._id)}
            disabled={cancelOrderMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX size={16} />
            {cancelOrderMutation.isPending ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>
    </div>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      toast.error("Please log in to view your orders");
      navigate("/login");
    }
  }, [user, navigate]);
  const { data, isLoading, error, refetch } = useUserOrders(
    currentPage,
    ordersPerPage
  );

  // Debug: Log the data from API
  React.useEffect(() => {
    if (data) {
      console.log("Orders data from API:", data);
      console.log("Orders array:", data?.orders);
      console.log("Total orders:", data?.total);
    }
  }, [data]);

  if (!user) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
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
            Failed to load orders
          </h2>
          <p className="text-gray-600 mb-4">
            {error.response?.data?.message || "Something went wrong"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];
  const totalPages = Math.ceil((data?.total || 0) / ordersPerPage);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? "text-blue-600 bg-blue-50 border border-blue-300"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;

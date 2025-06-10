import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCancelOrder } from "../../hooks/useOrder";
import { FiEye, FiX } from "react-icons/fi";
import OrderItem from "./OrderItem";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency, formatDate } from "../../utils/formatters";

const OrderCard = React.memo(({ order, onStatusChange, isAdmin }) => {
  const navigate = useNavigate();
  const cancelOrderMutation = useCancelOrder();

  // Debug order data
  console.log("OrderCard - Order data:", order);
  console.log("OrderCard - Order status:", order.status);
  console.log("OrderCard - Order orderStatus:", order.orderStatus);

  const handleStatusChange = useCallback(
    (newStatus) => {
      onStatusChange?.(order._id, newStatus);
    },
    [order._id, onStatusChange]
  );

  const handleCancelOrder = useCallback(async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrderMutation.mutateAsync(order._id);
      } catch {
        // Error is handled by the mutation hook
      }
    }
  }, [cancelOrderMutation, order._id]);

  const handleViewDetails = useCallback(() => {
    navigate(`/orders/${order._id}`);
  }, [navigate, order._id]);

  const canCancelOrder =
    (order.orderStatus || order.status)?.toLowerCase() === "pending";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{order._id.slice(-8).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Đặt hàng lúc {formatDate(order.createdAt)}
          </p>
        </div>{" "}
        <OrderStatusBadge
          orderStatus={order.orderStatus || order.status}
          onChange={isAdmin ? handleStatusChange : undefined}
        />
      </div>
      <div className="border-t border-gray-200 pt-4 mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Sản phẩm đã đặt
        </h4>
        <div className="space-y-2">
          {order.orderItems?.map((item, index) => (
            <OrderItem key={`${item.product?._id}-${index}`} item={item} />
          ))}
        </div>
      </div>{" "}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            <p>Giao hàng đến: {order.shippingInfo.address}</p>
            <p>Số điện thoại: {order.shippingInfo.phoneNo}</p>
          </div>
          <div className="text-right">
            {" "}
            <p className="text-lg font-bold text-gray-900">
              Tổng tiền: {formatCurrency(order.totalPrice || order.totalAmount)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={handleViewDetails}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            <FiEye size={16} />
            Xem chi tiết
          </button>
          {canCancelOrder && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelOrderMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiX size={16} />
              {cancelOrderMutation.isPending ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

OrderCard.displayName = "OrderCard";

export default OrderCard;

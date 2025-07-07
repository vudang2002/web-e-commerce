import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCancelOrder, useUpdateOrderStatus } from "../../hooks/useOrder";
import { useCreateMultipleReviews } from "../../hooks/useReview";
import { FiX, FiStar } from "react-icons/fi";
import OrderItem from "./OrderItem";
import OrderStatusBadge from "./OrderStatusBadge";
import ConfirmReceiveModal from "./ConfirmReceiveModal";
import ReviewModal from "./ReviewModal";
import { formatCurrency, formatDate } from "../../utils/formatters";

const OrderCard = React.memo(({ order, onStatusChange, isAdmin }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cancelOrderMutation = useCancelOrder();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const createReviewsMutation = useCreateMultipleReviews();

  // Modal states
  const [showConfirmReceiveModal, setShowConfirmReceiveModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

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
    if (window.confirm(t("orders.card.cancel_confirm"))) {
      try {
        await cancelOrderMutation.mutateAsync(order._id);
      } catch {
        // Error is handled by the mutation hook
      }
    }
  }, [cancelOrderMutation, order._id, t]);
  // Handle receive confirmation
  const handleConfirmReceive = useCallback(async () => {
    try {
      await updateOrderStatusMutation.mutateAsync({
        orderId: order._id,
        status: "Completed",
      });
      setShowConfirmReceiveModal(false);
    } catch {
      // Error is handled by the mutation hook
    }
  }, [updateOrderStatusMutation, order._id]);

  // Handle review submission
  const handleReviewSubmit = useCallback(
    async (reviewsArray) => {
      try {
        await createReviewsMutation.mutateAsync(reviewsArray);
        setShowReviewModal(false);
      } catch {
        // Error is handled by the mutation hook
      }
    },
    [createReviewsMutation]
  );

  const canCancelOrder =
    (order.orderStatus || order.status)?.toLowerCase() === "pending";

  const isDelivered =
    (order.orderStatus || order.status)?.toLowerCase() === "delivered";

  const isCompleted =
    (order.orderStatus || order.status)?.toLowerCase() === "completed";

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t("orders.card.order_id")} #{order._id.slice(-8).toUpperCase()}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t("orders.card.ordered_at")} {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge
            orderStatus={order.orderStatus || order.status}
            onChange={isAdmin ? handleStatusChange : undefined}
          />
        </div>
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            {t("orders.card.ordered_products")}
          </h4>
          <div className="space-y-2">
            {order.orderItems?.map((item, index) => (
              <div
                key={`${item.product?._id}-${index}`}
                onClick={() => navigate(`/orders/${order._id}`)}
                className="cursor-pointer hover:bg-gray-50 rounded transition-colors"
              >
                <OrderItem item={item} />
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              <p>
                {t("orders.card.delivery_to")} {order.shippingInfo.address}
              </p>
              <p>
                {t("orders.card.phone_number")} {order.shippingInfo.phoneNo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {t("orders.card.total_amount")}{" "}
                {formatCurrency(order.totalPrice || order.totalAmount)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {canCancelOrder && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelOrderMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiX size={16} />
                {cancelOrderMutation.isPending
                  ? t("orders.card.cancelling")
                  : t("orders.card.cancel_order")}
              </button>
            )}

            {/* Nút Đã Nhận Được Hàng / Đánh giá */}
            {isDelivered && (
              <button
                onClick={() => setShowConfirmReceiveModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-md hover:bg-green-100 transition-colors"
              >
                {t("orders.card.received_goods")}
              </button>
            )}

            {isCompleted && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
              >
                <FiStar size={16} />
                {t("orders.card.review_product")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmReceiveModal
        isOpen={showConfirmReceiveModal}
        onClose={() => setShowConfirmReceiveModal(false)}
        onConfirm={handleConfirmReceive}
        orderDetails={order}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
        orderDetails={order}
        isSubmitting={createReviewsMutation.isPending}
      />
    </>
  );
});

OrderCard.displayName = "OrderCard";

export default OrderCard;

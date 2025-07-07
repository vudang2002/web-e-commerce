import React from "react";
import { useTranslation } from "react-i18next";
import OrderStatusIcon from "./OrderStatusIcon";

// Status styles mapping
const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  shipping: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

const OrderStatusBadge = ({ orderStatus, size = "md" }) => {
  const { t } = useTranslation();

  // Debug props
  console.log("OrderStatusBadge - Received orderStatus:", orderStatus);

  const normalizedStatus = orderStatus?.toLowerCase() || "default";
  const colorClass = statusStyles[normalizedStatus] || statusStyles.default;

  console.log("OrderStatusBadge - Normalized status:", normalizedStatus);
  console.log("OrderStatusBadge - Color class:", colorClass);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-2 py-1 text-xs",
    lg: "px-4 py-2 text-base",
  };

  // Get translated status text
  const getStatusText = () => {
    if (!orderStatus) return t("orders.status.unknown");
    const statusKey = `orders.status.${normalizedStatus}`;
    const translatedStatus = t(statusKey);
    // If translation key doesn't exist, fallback to original capitalized text
    return translatedStatus !== statusKey
      ? translatedStatus
      : orderStatus?.charAt(0).toUpperCase() + orderStatus?.slice(1);
  };

  return (
    <span
      className={`inline-flex items-center gap-1 ${sizeClasses[size]} rounded-full font-medium border ${colorClass}`}
    >
      <OrderStatusIcon status={orderStatus} size={size === "lg" ? 20 : 16} />
      {getStatusText()}
    </span>
  );
};

export default React.memo(OrderStatusBadge);

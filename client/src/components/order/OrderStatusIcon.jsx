import React from "react";
import { FiPackage, FiTruck, FiCheck, FiX, FiClock } from "react-icons/fi";

const OrderStatusIcon = ({ status, size = 16, className = "" }) => {
  const iconProps = { size, className: `inline ${className}` };

  switch (status?.toLowerCase()) {
    case "pending":
    case "processing":
      return (
        <FiClock {...iconProps} className={`text-yellow-500 ${className}`} />
      );
    case "confirmed":
      return (
        <FiPackage {...iconProps} className={`text-blue-500 ${className}`} />
      );
    case "shipped":
    case "shipping":
      return (
        <FiTruck {...iconProps} className={`text-purple-500 ${className}`} />
      );
    case "delivered":
      return (
        <FiCheck {...iconProps} className={`text-green-500 ${className}`} />
      );
    case "cancelled":
      return <FiX {...iconProps} className={`text-red-500 ${className}`} />;
    default:
      return (
        <FiClock {...iconProps} className={`text-gray-500 ${className}`} />
      );
  }
};

export default React.memo(OrderStatusIcon);

import React from "react";
import { formatCurrency } from "../../utils/formatters";

const OrderItem = React.memo(({ item }) => (
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
        {formatCurrency(item.product?.price || item.price)}
      </p>
    </div>
    <div className="text-sm font-medium text-gray-900">
      {formatCurrency(item.quantity * item.product?.price || item.price)}
    </div>
  </div>
));

OrderItem.displayName = "OrderItem";

export default OrderItem;

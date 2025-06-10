import { useState, useEffect } from "react";

// Currency formatting utility
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

// Date formatting utility
export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

// Order status formatting
export const getStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

// Pagination utility for optimized rendering
export const usePagination = (items, itemsPerPage = 10) => {
  return {
    currentItems: items.slice(0, itemsPerPage),
    hasMore: items.length > itemsPerPage,
    loadMore: () => {
      // This would be implemented with state management
      // For now, it's a placeholder
    },
  };
};

// Debounce utility for search and input optimization
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized sort function
export const sortOrders = (
  orders,
  sortBy = "createdAt",
  sortOrder = "desc"
) => {
  return [...orders].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });
};

// Filter orders by status
export const filterOrdersByStatus = (orders, status) => {
  if (!status || status === "all") return orders;
  return orders.filter(
    (order) => order.status?.toLowerCase() === status.toLowerCase()
  );
};

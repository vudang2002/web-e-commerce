import React, { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiFilter, FiSearch } from "react-icons/fi";
import useProductSearch from "../../hooks/useProductSearch";

const OrderFilters = React.memo(
  ({ searchTerm, onSearchChange, statusFilter, onStatusFilterChange }) => {
    const { t } = useTranslation();

    const statusOptions = useMemo(
      () => [
        { value: "all", label: t("orders.filters.all_orders") },
        {
          value: "processing",
          label: t("orders.filters.processing"),
          color: "text-yellow-600",
        },
        {
          value: "confirmed",
          label: t("orders.filters.confirmed"),
          color: "text-blue-600",
        },
        {
          value: "shipping",
          label: t("orders.filters.shipping"),
          color: "text-purple-600",
        },
        {
          value: "delivered",
          label: t("orders.filters.delivered"),
          color: "text-green-600",
        },
        {
          value: "completed",
          label: t("orders.filters.completed"),
          color: "text-emerald-600",
        },
        {
          value: "cancelled",
          label: t("orders.filters.cancelled"),
          color: "text-red-600",
        },
        {
          value: "failed",
          label: t("orders.filters.failed"),
          color: "text-gray-600",
        },
        {
          value: "refunded",
          label: t("orders.filters.refunded"),
          color: "text-orange-600",
        },
      ],
      [t]
    );

    const { suggestions, isLoading, search, clear } = useProductSearch();

    // Gọi search khi searchTerm thay đổi
    React.useEffect(() => {
      if (searchTerm && searchTerm.trim().length > 0) {
        search(searchTerm);
      } else {
        clear();
      }
    }, [searchTerm, search, clear]);

    const handleSearchChange = useCallback(
      (e) => {
        onSearchChange(e.target.value);
      },
      [onSearchChange]
    );

    const handleStatusChange = useCallback(
      (status) => {
        onStatusFilterChange(status);
      },
      [onStatusFilterChange]
    );

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        {" "}
        {/* Status Filter Tabs */}
        <div className="flex items-center justify-between  gap-2 border-b border-gray-100 mb-2 ">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`relative px-3 py-2 text-sm font-medium bg-transparent border-none outline-none transition-colors whitespace-nowrap flex-shrink-0
                ${
                  statusFilter === option.value
                    ? "text-red-600 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[2px] after:h-[2px] after:bg-red-500 after:rounded-full"
                    : "text-gray-700 hover:text-red-500"
                }
              `}
              style={{ position: "relative" }}
            >
              {option.label}
            </button>
          ))}
        </div>
        {/* Search Input Below Tabs */}
        <div className="mt-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("orders.filters.search_placeholder")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors text-gray-700"
            />
            {/* Gợi ý sản phẩm đã mua hoặc id đơn hàng */}
            {searchTerm && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-3 text-center text-gray-500">
                    {t("orders.filters.searching")}
                  </div>
                ) : (
                  suggestions.map((item, idx) => (
                    <div
                      key={item._id || item.value || idx}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      {item.name || item.text || item.value}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

OrderFilters.displayName = "OrderFilters";

export default OrderFilters;

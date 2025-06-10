import React, { useMemo, useCallback } from "react";
import { FiFilter, FiSearch, FiChevronDown } from "react-icons/fi";

const OrderFilters = React.memo(
  ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    sortBy,
    onSortChange,
  }) => {
    const statusOptions = useMemo(
      () => [
        { value: "all", label: "All Orders" },
        { value: "pending", label: "Pending", color: "text-yellow-600" },
        { value: "processing", label: "Processing", color: "text-blue-600" },
        { value: "shipped", label: "Shipped", color: "text-purple-600" },
        { value: "delivered", label: "Delivered", color: "text-green-600" },
        { value: "cancelled", label: "Cancelled", color: "text-red-600" },
      ],
      []
    );

    const sortOptions = useMemo(
      () => [
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "total-high", label: "Highest Amount" },
        { value: "total-low", label: "Lowest Amount" },
        { value: "status", label: "By Status" },
      ],
      []
    );

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

    const handleSortChange = useCallback(
      (e) => {
        onSortChange(e.target.value);
      },
      [onSortChange]
    );

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders by ID or product name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500 w-4 h-4" />
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Status:
            </span>
            <div className="flex flex-wrap gap-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors whitespace-nowrap ${
                    statusFilter === option.value
                      ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                      : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                  } ${option.color || ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Sort:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OrderFilters.displayName = "OrderFilters";

export default OrderFilters;

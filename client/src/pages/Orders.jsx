import React, { useState, useMemo, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUserOrders } from "../hooks/useOrder";
import { FiPackage, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import Breadcrumb from "../components/common/Breadcrumb";

// Import OrderStates directly (not lazy) because it has complex structure
import OrderStates from "../components/order/OrderStates";

// Lazy load other components for better performance
const OrderCard = React.lazy(() => import("../components/order/OrderCard"));
const OrderFilters = React.lazy(() =>
  import("../components/order/OrderFilters")
);

// Import utilities
import { useDebounce } from "../utils/formatters";

const Orders = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [itemsPerPage] = useState(6);

  // Debounced search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Data fetching
  const { data: orders = [], isLoading, error, refetch } = useUserOrders(); // Debug logging
  console.log("Orders component - orders data:", orders);
  console.log("Orders component - orders length:", orders?.length);
  console.log("Orders component - orders type:", typeof orders);
  console.log("Orders component - is array:", Array.isArray(orders));
  console.log("Orders component - isLoading:", isLoading);
  console.log("Orders component - error:", error);
  // Memoized filtered and sorted orders
  const filteredAndSortedOrders = useMemo(() => {
    // Ensure orders is always an array
    if (!Array.isArray(orders) || orders.length === 0) {
      return [];
    }

    let filtered = [...orders]; // Create a copy to avoid mutations

    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.product?.name
              ?.toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase())
          )
      );
    } // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => {
        const orderStatus = (
          order.orderStatus ||
          order.status ||
          ""
        ).toLowerCase();
        return orderStatus === statusFilter.toLowerCase();
      });
    }

    // Apply sorting
    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "total-high":
          return b.totalAmount - a.totalAmount;
        case "total-low":
          return a.totalAmount - b.totalAmount;
        case "status": {
          const statusA = (a.orderStatus || a.status || "").toLowerCase();
          const statusB = (b.orderStatus || b.status || "").toLowerCase();
          return statusA.localeCompare(statusB);
        }
        default:
          return 0;
      }
    });
    return sorted;
  }, [orders, debouncedSearchTerm, statusFilter, sortBy]);
  // Memoized pagination
  const paginatedOrders = useMemo(() => {
    if (!Array.isArray(filteredAndSortedOrders)) {
      return [];
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedOrders, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    if (!Array.isArray(filteredAndSortedOrders)) {
      return 0;
    }
    return Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  }, [filteredAndSortedOrders, itemsPerPage]);

  // Memoized callbacks
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleOrderStatusChange = useCallback(
    (orderId, newStatus) => {
      // This would typically trigger a mutation to update order status
      toast.success(`${t('orders.order_status_updated')} ${newStatus}`);
      refetch();
    },
    [refetch, t]
  );
  const handleCreateNewOrder = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {" "}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <OrderStates.LoadingSkeleton count={3} />
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderStates.ErrorState
            message={error.message}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  } // Render empty state
  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderStates.EmptyState onCreateOrder={handleCreateNewOrder} />
          {/* Debug info */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              {t('orders.debug_info')}
            </h3>
            <p className="text-xs text-yellow-700">
              {t('orders.orders_length')} {orders?.length}
            </p>
            <p className="text-xs text-yellow-700">
              {t('orders.is_array')} {Array.isArray(orders) ? t('orders.yes') : t('orders.no')}
            </p>
            <p className="text-xs text-yellow-700">
              {t('orders.loading')} {isLoading ? t('orders.yes') : t('orders.no')}
            </p>
            <p className="text-xs text-yellow-700">
              {t('orders.error')} {error ? error.message : t('orders.none')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: t('orders.title'), path: "/orders" }]} />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FiPackage className="text-primary" />
                  {t('orders.my_orders')}
                </h1>
              </div>{" "}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8">
            <Suspense
              fallback={
                <div className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              }
            >
              <OrderFilters
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={handleStatusFilter}
                sortBy={sortBy}
                onSortChange={handleSort}
              />
            </Suspense>
          </div>

          {/* Orders Grid */}
          {paginatedOrders.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 mb-8">
                {paginatedOrders.map((order) => (
                  <Suspense
                    key={order._id}
                    fallback={
                      <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="h-16 bg-gray-100 rounded-lg"></div>
                        </div>
                        <div className="border-t pt-4">
                          <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
                        </div>
                      </div>
                    }
                  >
                    <OrderCard
                      order={order}
                      onStatusChange={handleOrderStatusChange}
                    />
                  </Suspense>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('orders.previous')}
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === currentPage;

                      // Show first page, last page, current page, and adjacent pages
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              isCurrentPage
                                ? "bg-indigo-600 text-white"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }

                      // Show ellipsis
                      if (
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 &&
                          currentPage < totalPages - 2)
                      ) {
                        return (
                          <span
                            key={page}
                            className="px-3 py-2 text-sm text-gray-500"
                          >
                            ...
                          </span>
                        );
                      }

                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('orders.next')}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* No results after filtering */
            <div className="text-center py-12">
              <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('orders.no_orders_found')}
              </h3>
              <p className="text-gray-500 mb-6">
                {t('orders.no_orders_message')}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                {t('orders.clear_filters')}
              </button>{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Orders.displayName = "Orders";

export default Orders;

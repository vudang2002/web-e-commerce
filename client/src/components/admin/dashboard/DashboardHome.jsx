import React, { useMemo } from "react";
import {
  FiShoppingCart,
  FiDollarSign,
  FiUsers,
  FiPackage,
} from "react-icons/fi";
import { useQuery } from "react-query";
import { getAllOrders } from "../../../services/orderService";
import { getAllProducts } from "../../../services/productService";
import { getAllUsers } from "../../../services/userService";

// Import components
import StatCard from "./StatCard";
import TopProductsCard from "./TopProductsCard";
import KPIOverviewCard from "./KPIOverviewCard";
import QuickActions from "./QuickActions";

// Import utility functions
import {
  extractOrders,
  extractProducts,
  extractUsers,
  calculateStats,
  getTopProducts,
  formatCurrency,
  formatNumber,
} from "./dashboardUtils";

const DashboardHome = () => {
  // API queries
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery("allOrders", () => getAllOrders({ page: 1, limit: 1000 }), {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery("allProducts", () => getAllProducts({ page: 1, limit: 1000 }), {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery("allUsers", () => getAllUsers({ page: 1, limit: 1000 }), {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Computed values using useMemo
  const orders = useMemo(() => extractOrders(ordersData), [ordersData]);
  const products = useMemo(() => extractProducts(productsData), [productsData]);
  const users = useMemo(() => extractUsers(usersData), [usersData]);

  // Calculate dashboard statistics
  const stats = useMemo(
    () => calculateStats(orders, products, users),
    [orders, products, users]
  );

  // Get top selling products
  const topProducts = useMemo(() => getTopProducts(products), [products]);

  const loading = ordersLoading || productsLoading || usersLoading;
  const hasError = ordersError || productsError || usersError;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">
          Đang tải dữ liệu dashboard...
        </span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        {/* Header với thông báo lỗi */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="text-sm text-red-500 flex items-center">
            <FiPackage className="h-4 w-4 mr-1" />
            Chế độ offline - Dữ liệu mẫu
          </div>
        </div>

        {/* KPI Cards với dữ liệu mẫu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng số đơn hàng"
            value={formatNumber(42)}
            icon={FiShoppingCart}
            color="#3B82F6"
            subtext="Dữ liệu mẫu"
          />
          <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(1234567)}
            icon={FiDollarSign}
            color="#10B981"
            subtext="Dữ liệu mẫu"
          />
          <StatCard
            title="Tổng số khách hàng"
            value={formatNumber(156)}
            icon={FiUsers}
            color="#F59E0B"
            subtext="Dữ liệu mẫu"
          />
          <StatCard
            title="Tổng số sản phẩm"
            value={formatNumber(89)}
            icon={FiPackage}
            color="#EF4444"
            subtext="Dữ liệu mẫu"
          />
        </div>

        {/* Error Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <FiPackage className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Không thể kết nối server
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Dashboard đang hoạt động ở chế độ offline với dữ liệu mẫu.
                </p>
                <p className="mt-1">
                  <strong>Cách khắc phục:</strong> Hãy chạy server backend trước
                  khi truy cập dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        <QuickActions />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng số đơn hàng"
          value={formatNumber(stats.totalOrders)}
          icon={FiShoppingCart}
          color="#3B82F6"
          subtext="Tất cả đơn hàng"
        />
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(stats.totalRevenue)}
          icon={FiDollarSign}
          color="#10B981"
          subtext="Tổng thu nhập"
        />
        <StatCard
          title="Tổng số khách hàng"
          value={formatNumber(stats.totalCustomers)}
          icon={FiUsers}
          color="#F59E0B"
          subtext="Người dùng đăng ký"
        />
        <StatCard
          title="Tổng số sản phẩm"
          value={formatNumber(stats.totalProducts)}
          icon={FiPackage}
          color="#EF4444"
          subtext="Sản phẩm trong kho"
        />
      </div>

      {/* Charts and Top Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KPIOverviewCard
          stats={stats}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
        />
        <TopProductsCard
          products={topProducts}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
        />
      </div>

      <QuickActions />
    </div>
  );
};

export default DashboardHome;

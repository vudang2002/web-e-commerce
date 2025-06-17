import axiosClient from "../utils/axiosClient";

const API_URL = "/dashboard";

// Get dashboard statistics
export const getDashboardStats = async () => {
  return await axiosClient.get(`${API_URL}/stats`);
};

// Get top selling products
export const getTopSellingProducts = async (limit = 10) => {
  return await axiosClient.get(`${API_URL}/top-products?limit=${limit}`);
};

// Get revenue statistics
export const getRevenueStats = async (period = "month") => {
  return await axiosClient.get(`${API_URL}/revenue?period=${period}`);
};

// Get order statistics
export const getOrderStatistics = async () => {
  return await axiosClient.get(`${API_URL}/order-stats`);
};

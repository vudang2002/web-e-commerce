import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Create axios instance with default config
const orderAPI = axios.create({
  baseURL: `${API_BASE_URL}/orders`,
});

// Add auth token to requests
orderAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create order
export const createOrder = async (orderData) => {
  const response = await orderAPI.post("/", orderData);
  return response.data;
};

// Get user orders
export const getUserOrders = async (page = 1, limit = 10) => {
  try {
    console.log("Making API call to get user orders:", { page, limit });
    const response = await orderAPI.get(`/user?page=${page}&limit=${limit}`);
    console.log("API response:", response);
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const response = await orderAPI.get(`/${orderId}`);
  return response.data;
};

// Update order status (for admin)
export const updateOrderStatus = async (orderId, status) => {
  const response = await orderAPI.patch(`/${orderId}/status`, { status });
  return response.data;
};

// Cancel order
export const cancelOrder = async (orderId) => {
  const response = await orderAPI.patch(`/${orderId}/cancel`);
  return response.data;
};

// Get order statistics (for admin)
export const getOrderStats = async () => {
  const response = await orderAPI.get("/stats");
  return response.data;
};

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
};

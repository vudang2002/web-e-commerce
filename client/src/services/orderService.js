import axiosClient from "../utils/axiosClient";

const API_URL = "/orders";

// Create order
export const createOrder = async (orderData) => {
  return await axiosClient.post(API_URL, orderData);
};

// Get user orders
export const getUserOrders = async (page = 1, limit = 10) => {
  return await axiosClient.get(`${API_URL}/user?page=${page}&limit=${limit}`);
};

// Get all orders (for admin)
export const getAllOrders = async (page = 1, limit = 10) => {
  return await axiosClient.get(`${API_URL}/all?page=${page}&limit=${limit}`);
};

// Get order by ID
export const getOrderById = async (orderId) => {
  return await axiosClient.get(`${API_URL}/${orderId}`);
};

// Update order status (for admin)
export const updateOrderStatus = async (orderId, status) => {
  return await axiosClient.patch(`${API_URL}/${orderId}/status`, {
    orderStatus: status,
  });
};

// Update order (for admin)
export const updateOrder = async (orderId, orderData) => {
  return await axiosClient.put(`${API_URL}/${orderId}`, orderData);
};

// Cancel order
export const cancelOrder = async (orderId) => {
  return await axiosClient.patch(`${API_URL}/${orderId}/cancel`);
};

// Delete order (for admin)
export const deleteOrder = async (orderId) => {
  return await axiosClient.delete(`${API_URL}/${orderId}`);
};

// Get order statistics (for admin)
export const getOrderStats = async () => {
  return await axiosClient.get(`${API_URL}/stats`);
};

export default {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrder,
  cancelOrder,
  deleteOrder,
  getOrderStats,
};

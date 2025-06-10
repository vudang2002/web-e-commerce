import axiosClient from "../utils/axiosClient";

// Đường dẫn API đã được cập nhật để khớp với định nghĩa trong server
const API_URL = "/users";
const AUTH_URL = "/auth";

export const getUsers = async (query = "") => {
  return await axiosClient.get(`${API_URL}${query}`);
};

export const getAllUsers = async (params = {}) => {
  const { page = 1, limit = 1000 } = params;
  return await axiosClient.get(`${API_URL}?page=${page}&limit=${limit}`);
};

export const getUserById = async (id) => {
  return await axiosClient.get(`${API_URL}/${id}`);
};

// Sử dụng API admin để tạo user mới (khác với đăng ký thông thường)
export const createUser = async (data) => {
  return await axiosClient.post(`${API_URL}`, data);
};

export const updateUser = async (id, data) => {
  return await axiosClient.put(`${API_URL}/${id}`, data);
};

export const deleteUser = async (id) => {
  return await axiosClient.delete(`${API_URL}/${id}`);
};

export const updateUserRole = async (id, role) => {
  return await axiosClient.patch(`${API_URL}/${id}/role`, { role });
};

export const updateUserStatus = async (id, status) => {
  return await axiosClient.patch(`${API_URL}/${id}/status`, { status });
};

// Bổ sung: API cập nhật trạng thái seller nếu backend có hỗ trợ
export const updateSellerStatus = async (id, isSeller) => {
  return await axiosClient.patch(`${API_URL}/${id}/seller-status`, {
    isSeller,
  });
};

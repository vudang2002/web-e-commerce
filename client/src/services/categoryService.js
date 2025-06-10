import axiosClient from "../utils/axiosClient";

const API_URL = "/categories";

export const getCategories = async () => {
  return await axiosClient.get(API_URL);
};

export const getCategoryById = async (id) => {
  return await axiosClient.get(`${API_URL}/${id}`);
};

export const getCategoryBySlug = async (slug) => {
  return await axiosClient.get(`${API_URL}/slug/${slug}`);
};

export const createCategory = async (data) => {
  return await axiosClient.post(API_URL, data);
};

export const updateCategory = async (id, data) => {
  return await axiosClient.put(`${API_URL}/${id}`, data);
};

export const deleteCategory = async (id) => {
  return await axiosClient.delete(`${API_URL}/${id}`);
};

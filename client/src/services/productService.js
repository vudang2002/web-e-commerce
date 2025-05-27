import axiosClient from "../utils/axiosClient";

const API_URL = "/products";

export const getProducts = async (queryParams = "") => {
  return await axiosClient.get(`${API_URL}${queryParams}`);
};

export const getProductById = async (id) => {
  return await axiosClient.get(`${API_URL}/${id}`);
};

export const createProduct = async (productData) => {
  return await axiosClient.post(API_URL, productData);
};

export const updateProduct = async (id, productData) => {
  return await axiosClient.put(`${API_URL}/${id}`, productData);
};

export const deleteProduct = async (id) => {
  return await axiosClient.delete(`${API_URL}/${id}`);
};

export const deleteBulkProducts = async (productIds) => {
  return await axiosClient.delete(`${API_URL}/bulk-delete`, {
    data: { productIds },
  });
};

export const getFeaturedProducts = async () => {
  return await axiosClient.get(`${API_URL}/featured`);
};

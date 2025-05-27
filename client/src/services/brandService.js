import axiosClient from "../utils/axiosClient";

const API_URL = "/brands";

export const getBrands = async (query = "") => {
  return await axiosClient.get(`${API_URL}${query}`);
};

export const getBrandById = async (id) => {
  return await axiosClient.get(`${API_URL}/${id}`);
};

export const createBrand = async (data) => {
  return await axiosClient.post(API_URL, data);
};

export const updateBrand = async (id, data) => {
  return await axiosClient.put(`${API_URL}/${id}`, data);
};

export const deleteBrand = async (id) => {
  return await axiosClient.delete(`${API_URL}/${id}`);
};

export const deleteBulkBrands = async (brandIds) => {
  return await axiosClient.delete(`${API_URL}/bulk-delete`, {
    data: { brandIds },
  });
};

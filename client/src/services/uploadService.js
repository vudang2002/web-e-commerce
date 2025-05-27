import axiosClient from "../utils/axiosClient";

const API_URL = "/upload";

export const uploadProductImages = async (formData) => {
  // Khuyến nghị không thiết lập Content-Type khi gửi FormData
  // để axios tự động xác định đúng Content-Type và boundary
  return await axiosClient.post(`${API_URL}/product`, formData, {
    headers: {
      "Content-Type": undefined,
    },
  });
};

export const uploadSingleImage = async (formData) => {
  // Đảm bảo không thiết lập lại Content-Type để axios tự xác định đúng boundary cho FormData
  return await axiosClient.post(`${API_URL}/category`, formData, {
    headers: {
      "Content-Type": undefined, // Để axios tự động xác định Content-Type và boundary
    },
  });
};

export const uploadCategoryImage = async (formData) => {
  // Đặc biệt cho danh mục - sử dụng API endpoint dành riêng
  return await axiosClient.post(`${API_URL}/category`, formData, {
    headers: {
      "Content-Type": undefined, // Để axios tự động xác định Content-Type và boundary
    },
  });
};

export const uploadBrandImage = async (formData) => {
  // Đặc biệt cho nhãn hiệu (brand) - sử dụng API endpoint dành riêng
  return await axiosClient.post(`${API_URL}/brand`, formData, {
    headers: {
      "Content-Type": undefined, // Để axios tự động xác định Content-Type và boundary
    },
  });
};

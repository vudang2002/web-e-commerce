import axiosClient from "../utils/axiosClient";

const API_URL = "/cart";

// Lấy giỏ hàng của user hiện tại
export const getCart = async () => {
  try {
    console.log("cartService.getCart - Making API call to:", API_URL);
    const response = await axiosClient.get(API_URL);
    console.log("cartService.getCart - Response from axiosClient:", response);
    console.log("cartService.getCart - Response type:", typeof response);
    console.log("cartService.getCart - cartItems:", response?.cartItems);
    console.log(
      "cartService.getCart - cartItems length:",
      response?.cartItems?.length
    );

    // axiosClient đã trả về response.data rồi, không cần .data nữa
    return response;
  } catch (error) {
    console.error("cartService.getCart - Error:", error);
    throw error;
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (productId, quantity) => {
  return await axiosClient.post(`${API_URL}/add`, {
    productId,
    quantity,
  });
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (productId, quantity) => {
  return await axiosClient.put(`${API_URL}/update`, {
    productId,
    quantity,
  });
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeCartItem = async (productId) => {
  return await axiosClient.delete(`${API_URL}/remove`, {
    data: { productId },
  });
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async () => {
  return await axiosClient.delete(`${API_URL}/clear`);
};

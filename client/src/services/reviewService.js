import axiosClient from "../utils/axiosClient";

const API_URL = "/reviews";

// Create review
export const createReview = async (reviewData) => {
  return await axiosClient.post(API_URL, reviewData);
};

// Get reviews for a product
export const getReviewsByProduct = async (productId) => {
  return await axiosClient.get(`${API_URL}/${productId}`);
};

// Delete review
export const deleteReview = async (reviewId) => {
  return await axiosClient.delete(`${API_URL}/${reviewId}`);
};

// Create multiple reviews (for order)
export const createMultipleReviews = async (reviewsArray) => {
  // Create reviews one by one since the API doesn't support bulk creation
  const results = await Promise.all(
    reviewsArray.map((reviewData) => createReview(reviewData))
  );
  return results;
};

export default {
  createReview,
  getReviewsByProduct,
  deleteReview,
  createMultipleReviews,
};

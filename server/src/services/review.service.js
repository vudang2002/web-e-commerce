import Review from "../models/review.model.js";

export const createReview = async (reviewData) => {
  return await Review.create(reviewData);
};

export const getReviewsByProduct = async (productId) => {
  return await Review.find({ product: productId }).populate("user", "name");
};

export const deleteReview = async (reviewId) => {
  return await Review.findByIdAndDelete(reviewId);
};

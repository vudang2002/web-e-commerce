import * as reviewService from "../services/review.service.js";
import { createResponse } from "../utils/response.util.js";

export const createReview = async (req, res) => {
  console.log("Request body:", req.body); // Log dữ liệu từ request body
  const reviewData = { ...req.body, user: req.user._id };
  const review = await reviewService.createReview(reviewData);
  res.status(201).json(createResponse(review));
};

export const getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;
  const reviews = await reviewService.getReviewsByProduct(productId);
  res.json(createResponse(reviews));
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  await reviewService.deleteReview(id);
  res.json({ success: true, message: "Review deleted successfully" });
};

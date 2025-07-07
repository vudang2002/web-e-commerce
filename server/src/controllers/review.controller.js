import * as reviewService from "../services/review.service.js";
import { createResponse } from "../utils/response.util.js";

export const createReview = async (req, res) => {
  try {
    console.log("=== CREATE REVIEW CONTROLLER ===");
    console.log("Request body:", req.body); // Log dữ liệu từ request body
    console.log("User from token:", req.user); // Log user info

    const reviewData = { ...req.body, user: req.user._id };
    console.log("Review data to create:", reviewData);

    const review = await reviewService.createReview(reviewData);
    console.log("Review created successfully:", review);

    res.status(201).json(createResponse(review));
  } catch (error) {
    console.error("❌ Error creating review:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Có lỗi xảy ra khi tạo đánh giá",
    });
  }
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

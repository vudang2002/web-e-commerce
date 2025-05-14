import express from "express";
import * as reviewController from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createReviewValidationRules } from "../validators/review.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware(),
  validate(createReviewValidationRules),
  reviewController.createReview
);
router.get("/:productId", reviewController.getReviewsByProduct);
router.delete("/:id", authMiddleware(), reviewController.deleteReview);

export default router;

import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import {
  authMiddleware,
  authorizeAdminOrSeller,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { categoryValidationRules } from "../validators/category.validator.js";

const router = express.Router();

// Get all categories
router.get("/", categoryController.getCategories);

// Get a category by ID
router.get("/:id", categoryController.getCategoryById);

// Create a new category
router.post(
  "/",
  authMiddleware("admin"),
  authorizeAdminOrSeller(),
  validate(categoryValidationRules),
  categoryController.createCategory
);

// Update a category by ID
router.put(
  "/:id",
  authMiddleware("admin"),

  authorizeAdminOrSeller(),
  validate(categoryValidationRules),
  categoryController.updateCategory
);

// Delete a category by ID
router.delete(
  "/:id",
  authMiddleware("admin"),

  authorizeAdminOrSeller(),
  categoryController.deleteCategory
);

export default router;

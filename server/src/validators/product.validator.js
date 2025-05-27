import { body } from "express-validator";

export const productValidationRules = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 1000 })
    .withMessage("Name must be between 3 and 1000 characters"),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid ID"),
  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array")
    .custom((images) => {
      if (
        !images.every(
          (url) => typeof url === "string" && url.startsWith("http")
        )
      ) {
        throw new Error("Each image must be a valid URL");
      }
      return true;
    }),
];

export const bulkProductValidationRules = [
  body().isArray().withMessage("Request body should be an array of products"),
  body("*.name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 1000 })
    .withMessage("Name must be between 3 and 1000 characters"),
  body("*.description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
  body("*.price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("*.category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid ID"),
  body("*.stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("*.images")
    .optional()
    .isArray()
    .withMessage("Images must be an array")
    .custom((images) => {
      if (
        !images.every(
          (url) => typeof url === "string" && url.startsWith("http")
        )
      ) {
        throw new Error("Each image must be a valid URL");
      }
      return true;
    }),
];

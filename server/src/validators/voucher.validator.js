import { body, param } from "express-validator";

export const createVoucherValidation = [
  body("code")
    .notEmpty()
    .withMessage("Voucher code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Voucher code must be between 3 and 20 characters")
    .matches(/^[A-Z0-9]+$/)
    .withMessage(
      "Voucher code must contain only uppercase letters and numbers"
    ),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("discountType")
    .isIn(["percentage", "fixed"])
    .withMessage("Discount type must be either 'percentage' or 'fixed'"),

  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Amount must be greater than or equal to 0")
    .custom((value, { req }) => {
      if (req.body.discountType === "percentage" && value > 100) {
        throw new Error("Percentage discount cannot exceed 100%");
      }
      return true;
    }),

  body("minOrderValue")
    .optional()
    .isNumeric()
    .withMessage("Minimum order value must be a number")
    .isFloat({ min: 0 })
    .withMessage("Minimum order value must be greater than or equal to 0"),

  body("usageLimit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Usage limit must be at least 1"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  body("expireAt")
    .optional()
    .isISO8601()
    .withMessage("Expire date must be a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Expire date must be in the future");
      }
      return true;
    }),
];

export const updateVoucherValidation = [
  param("id").isMongoId().withMessage("Invalid voucher ID"),

  body("code")
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("Voucher code must be between 3 and 20 characters")
    .matches(/^[A-Z0-9]+$/)
    .withMessage(
      "Voucher code must contain only uppercase letters and numbers"
    ),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("discountType")
    .optional()
    .isIn(["percentage", "fixed"])
    .withMessage("Discount type must be either 'percentage' or 'fixed'"),

  body("amount")
    .optional()
    .isNumeric()
    .withMessage("Amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Amount must be greater than or equal to 0")
    .custom((value, { req }) => {
      if (req.body.discountType === "percentage" && value > 100) {
        throw new Error("Percentage discount cannot exceed 100%");
      }
      return true;
    }),

  body("minOrderValue")
    .optional()
    .isNumeric()
    .withMessage("Minimum order value must be a number")
    .isFloat({ min: 0 })
    .withMessage("Minimum order value must be greater than or equal to 0"),

  body("usageLimit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Usage limit must be at least 1"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  body("expireAt")
    .optional()
    .isISO8601()
    .withMessage("Expire date must be a valid date"),
];

export const voucherIdValidation = [
  param("id").isMongoId().withMessage("Invalid voucher ID"),
];

export const voucherCodeValidation = [
  param("code")
    .notEmpty()
    .withMessage("Voucher code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Voucher code must be between 3 and 20 characters"),
];

export const applyVoucherValidation = [
  body("voucherCode")
    .notEmpty()
    .withMessage("Voucher code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Voucher code must be between 3 and 20 characters"),

  body("orderValue")
    .isNumeric()
    .withMessage("Order value must be a number")
    .isFloat({ min: 0 })
    .withMessage("Order value must be greater than 0"),
];

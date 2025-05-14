import { body } from "express-validator";

export const createOrderValidationRules = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be an array with at least one item"),
  body("items.*.productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID"),
  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required"),
  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["COD", "Online"])
    .withMessage("Payment method must be either 'COD' or 'Online'"),
];

export const updateOrderStatusValidationRules = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Pending", "Shipped", "Delivered", "Cancelled"])
    .withMessage("Invalid status value"),
];

export const markAsPaidValidationRules = [
  body("isPaid")
    .notEmpty()
    .withMessage("isPaid is required")
    .isBoolean()
    .withMessage("isPaid must be a boolean"),
];

export const refundOrderValidationRules = [
  body("isRefunded")
    .notEmpty()
    .withMessage("isRefunded is required")
    .isBoolean()
    .withMessage("isRefunded must be a boolean"),
];

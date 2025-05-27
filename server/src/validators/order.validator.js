import { body } from "express-validator";
import Product from "../models/product.model.js";

// Custom middleware để kiểm tra stock availability
export const validateStockAvailability = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Items must be provided as an array",
      });
    }

    const stockErrors = [];

    // Kiểm tra từng sản phẩm
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        stockErrors.push({
          productId: item.productId,
          message: "Product not found",
        });
        continue;
      }

      // Kiểm tra trạng thái sản phẩm
      if (product.status === "inactive") {
        stockErrors.push({
          productId: item.productId,
          productName: product.name,
          message: "Product is currently inactive",
        });
        continue;
      }

      // Kiểm tra số lượng tồn kho
      if (product.stock < item.quantity) {
        stockErrors.push({
          productId: item.productId,
          productName: product.name,
          requestedQuantity: item.quantity,
          availableStock: product.stock,
          message: `Insufficient stock. Requested: ${item.quantity}, Available: ${product.stock}`,
        });
      }

      // Kiểm tra số lượng đặt hàng hợp lý (không quá 100 sản phẩm cùng loại)
      if (item.quantity > 100) {
        stockErrors.push({
          productId: item.productId,
          productName: product.name,
          message: "Cannot order more than 100 units of the same product",
        });
      }
    }

    if (stockErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Stock validation failed",
        errors: stockErrors,
      });
    }

    next();
  } catch (error) {
    console.error("Stock validation error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating stock availability",
    });
  }
};

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

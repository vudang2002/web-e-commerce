import express from "express";
import * as productController from "../controllers/product.controller.js";
import {
  authMiddleware,
  authorizeAdminOrSeller,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { productValidationRules } from "../validators/product.validator.js";
import { checkOwnershipOrAdmin } from "../middlewares/ownership.middleware.js";

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/featured", productController.getFeaturedProducts);

router.post(
  "/",
  authMiddleware(), // Cho phép cả admin và seller
  authorizeAdminOrSeller(),
  validate(productValidationRules),
  productController.createProduct
);
router.put(
  "/:id",
  authMiddleware(),
  checkOwnershipOrAdmin, // Kiểm tra quyền sở hữu hoặc admin
  validate(productValidationRules),
  productController.updateProduct
);
router.delete(
  "/:id",
  authMiddleware("admin"),
  checkOwnershipOrAdmin,
  productController.deleteProduct
);

router.patch(
  "/:id/status",
  authMiddleware("admin"),
  checkOwnershipOrAdmin,
  productController.updateProductStatus
);
router.patch(
  "/:id/feature",
  authMiddleware("admin"),

  productController.toggleProductFeature
);

export default router;

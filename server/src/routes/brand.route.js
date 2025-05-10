import express from "express";
import * as brandController from "../controllers/brand.controller.js";
import {
  authMiddleware,
  authorizeAdminOrSeller,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { brandValidationRules } from "../validators/brand.validator.js";

const router = express.Router();

router.get("/", authMiddleware("admin"), brandController.getBrands);
router.get("/:id", brandController.getBrandById);
router.post(
  "/",
  authMiddleware("admin"),
  authorizeAdminOrSeller(),
  validate(brandValidationRules),
  brandController.createBrand
);
router.put(
  "/:id",
  authMiddleware("admin"),

  authorizeAdminOrSeller(),
  validate(brandValidationRules),
  brandController.updateBrand
);
router.delete(
  "/:id",
  authMiddleware("admin"),

  authorizeAdminOrSeller(),
  brandController.deleteBrand
);

export default router;

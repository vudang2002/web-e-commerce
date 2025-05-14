import express from "express";
import * as cartController from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addToCartValidationRules,
  updateCartItemValidationRules,
  removeCartItemValidationRules,
} from "../validators/cart.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.get("/", authMiddleware(), cartController.getCart);
router.post(
  "/add",
  authMiddleware(),
  validate(addToCartValidationRules),
  cartController.addToCart
);
router.put(
  "/update",
  authMiddleware(),
  validate(updateCartItemValidationRules),
  cartController.updateCartItem
);
router.delete(
  "/remove",
  authMiddleware(),
  validate(removeCartItemValidationRules),
  cartController.removeCartItem
);
router.delete("/clear", authMiddleware(), cartController.clearCart);

export default router;

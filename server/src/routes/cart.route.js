import express from "express";
import * as cartController from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addToCartValidationRules,
  updateCartItemValidationRules,
  removeCartItemValidationRules,
} from "../validators/cart.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API for managing the shopping cart
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       quantity:
 *                         type: number
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item added to the cart
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/cart/{productId}:
 *   put:
 *     summary: Update the quantity of an item in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Item not found in the cart
 */

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Item removed from the cart
 *       404:
 *         description: Item not found in the cart
 */

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

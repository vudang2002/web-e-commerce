import express from "express";
import * as orderController from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createOrderValidationRules,
  updateOrderValidationRules,
  updateOrderStatusValidationRules,
  markAsPaidValidationRules,
  refundOrderValidationRules,
  validateStockAvailability,
} from "../validators/order.validator.js";

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
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for the current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   total:
 *                     type: number
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 total:
 *                   type: number
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Cancel an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       404:
 *         description: Order not found
 */

const router = express.Router();

router.post(
  "/",
  authMiddleware(),
  validate(createOrderValidationRules),
  validateStockAvailability,
  orderController.createOrder
);
router.get("/all", authMiddleware("admin"), orderController.getAllOrders);
router.get("/user", authMiddleware(), orderController.getUserOrders);
router.get("/:id", authMiddleware(), orderController.getOrderById);
router.put(
  "/:id",
  authMiddleware("admin"),
  validate(updateOrderValidationRules),
  orderController.updateOrder
);
router.patch(
  "/:id/status",
  authMiddleware("admin"),
  validate(updateOrderStatusValidationRules),
  orderController.updateOrderStatus
);
router.delete("/:id", authMiddleware("admin"), orderController.deleteOrder);
router.patch(
  "/:id/paid",
  authMiddleware("admin"),
  validate(markAsPaidValidationRules),
  orderController.markAsPaid
);
router.patch(
  "/:id/refund",
  authMiddleware("admin"),
  validate(refundOrderValidationRules),
  orderController.refundOrder
);

export default router;

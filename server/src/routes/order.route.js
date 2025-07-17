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
 *     description: Retrieves all orders placed by the current authenticated user. Supports pagination.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled, refunded]
 *         description: Filter orders by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, total]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Order ID
 *                           orderNumber:
 *                             type: string
 *                             description: Unique order number
 *                           user:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                           items:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 product:
 *                                   type: object
 *                                   properties:
 *                                     _id:
 *                                       type: string
 *                                     name:
 *                                       type: string
 *                                     price:
 *                                       type: number
 *                                     image:
 *                                       type: string
 *                                 quantity:
 *                                   type: number
 *                                 price:
 *                                   type: number
 *                           shippingAddress:
 *                             type: object
 *                             properties:
 *                               address:
 *                                 type: string
 *                               city:
 *                                 type: string
 *                               postalCode:
 *                                 type: string
 *                               country:
 *                                 type: string
 *                               phone:
 *                                 type: string
 *                           paymentMethod:
 *                             type: string
 *                             enum: [COD, PayPal, Credit Card, Bank Transfer, Momo]
 *                           paymentResult:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               status:
 *                                 type: string
 *                               update_time:
 *                                 type: string
 *                               email_address:
 *                                 type: string
 *                           subtotal:
 *                             type: number
 *                             description: Order subtotal before discounts
 *                           shippingFee:
 *                             type: number
 *                             description: Shipping fee
 *                           tax:
 *                             type: number
 *                             description: Tax amount
 *                           discount:
 *                             type: number
 *                             description: Discount amount
 *                           total:
 *                             type: number
 *                             description: Final order total
 *                           status:
 *                             type: string
 *                             enum: [pending, processing, shipped, delivered, cancelled, refunded]
 *                           isPaid:
 *                             type: boolean
 *                             description: Whether the order has been paid
 *                           paidAt:
 *                             type: string
 *                             format: date-time
 *                             description: When the order was paid
 *                           isDelivered:
 *                             type: boolean
 *                             description: Whether the order has been delivered
 *                           deliveredAt:
 *                             type: string
 *                             format: date-time
 *                             description: When the order was delivered
 *                           voucher:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               code:
 *                                 type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalDocs:
 *                           type: number
 *                           description: Total number of orders
 *                         limit:
 *                           type: number
 *                           description: Number of orders per page
 *                         page:
 *                           type: number
 *                           description: Current page number
 *                         totalPages:
 *                           type: number
 *                           description: Total number of pages
 *                         hasNextPage:
 *                           type: boolean
 *                           description: Whether there is a next page
 *                         hasPrevPage:
 *                           type: boolean
 *                           description: Whether there is a previous page
 *       401:
 *         description: Not authorized, no token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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

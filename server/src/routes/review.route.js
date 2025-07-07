/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing product reviews
 */

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
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   rating:
 *                     type: number
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 content:
 *                   type: string
 *                 rating:
 *                   type: number
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */

import express from "express";
import * as reviewController from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkReviewPermission } from "../middlewares/review.middleware.js";
import { createReviewValidationRules } from "../validators/review.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

// Debug route - xóa sau khi fix xong
router.get("/debug/orders/:productId", authMiddleware(), async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const Order = (await import("../models/order.model.js")).default;

    const orders = await Order.find({
      user: userId,
      "orderItems.product": productId,
    });

    res.json({
      success: true,
      data: {
        userId,
        productId,
        ordersCount: orders.length,
        orders: orders.map((order) => ({
          id: order._id,
          status: order.orderStatus,
          createdAt: order.createdAt,
          orderItems: order.orderItems,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Debug route - tạo đơn hàng test (xóa sau khi fix xong)
router.post(
  "/debug/create-test-order/:productId",
  authMiddleware(),
  async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user._id;

      const Order = (await import("../models/order.model.js")).default;

      const testOrder = new Order({
        user: userId,
        orderItems: [
          {
            product: productId,
            quantity: 1,
          },
        ],
        shippingInfo: {
          address: "Test Address",
          phoneNo: "0123456789",
        },
        paymentMethod: "COD",
        itemsPrice: 100000,
        shippingPrice: 30000,
        totalPrice: 130000,
        orderStatus: "Completed", // Đặt trạng thái là Completed để có thể review
      });

      await testOrder.save();

      res.json({
        success: true,
        message: "Test order created successfully",
        data: testOrder,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Route tạo review không cần kiểm tra đơn hàng (để test)
router.post(
  "/test",
  authMiddleware(),
  validate(createReviewValidationRules),
  reviewController.createReview
);

router.post(
  "/",
  authMiddleware(),
  validate(createReviewValidationRules),
  checkReviewPermission,
  reviewController.createReview
);
router.get("/:productId", reviewController.getReviewsByProduct);
router.delete("/:id", authMiddleware(), reviewController.deleteReview);

export default router;

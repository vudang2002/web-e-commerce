import express from "express";
import * as voucherController from "../controllers/voucher.controller.js";
import {
  authMiddleware,
  authorizeAdminOrSeller,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createVoucherValidation,
  updateVoucherValidation,
  voucherIdValidation,
  voucherCodeValidation,
  applyVoucherValidation,
} from "../validators/voucher.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vouchers
 *   description: API for managing vouchers
 */

/**
 * @swagger
 * /api/vouchers:
 *   post:
 *     summary: Create a new voucher (Admin only)
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - amount
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SUMMER20"
 *               description:
 *                 type: string
 *                 example: "Summer sale 20% off"
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: "percentage"
 *               amount:
 *                 type: number
 *                 example: 20
 *               minOrderValue:
 *                 type: number
 *                 example: 100
 *               usageLimit:
 *                 type: number
 *                 example: 1000
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               expireAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Voucher created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authMiddleware(),
  authorizeAdminOrSeller(),

  validate(createVoucherValidation),
  voucherController.createVoucher
);

/**
 * @swagger
 * /api/vouchers:
 *   get:
 *     summary: Get all vouchers with pagination
 *     tags: [Vouchers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: discountType
 *         schema:
 *           type: string
 *           enum: [percentage, fixed]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Vouchers retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", voucherController.getAllVouchers);

/**
 * @swagger
 * /api/vouchers/available:
 *   get:
 *     summary: Get available vouchers for an order value
 *     tags: [Vouchers]
 *     parameters:
 *       - in: query
 *         name: orderValue
 *         schema:
 *           type: number
 *         description: The order value to check voucher eligibility
 *     responses:
 *       200:
 *         description: Available vouchers retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/available", voucherController.getAvailableVouchers);

/**
 * @swagger
 * /api/vouchers/apply:
 *   post:
 *     summary: Apply a voucher to check discount
 *     tags: [Vouchers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - voucherCode
 *               - orderValue
 *             properties:
 *               voucherCode:
 *                 type: string
 *                 example: "SUMMER20"
 *               orderValue:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Voucher applied successfully
 *       400:
 *         description: Invalid voucher or order value
 */
router.post(
  "/apply",

  validate(applyVoucherValidation),
  voucherController.applyVoucher
);

/**
 * @swagger
 * /api/vouchers/code/{code}:
 *   get:
 *     summary: Get voucher by code
 *     tags: [Vouchers]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Voucher code
 *     responses:
 *       200:
 *         description: Voucher retrieved successfully
 *       404:
 *         description: Voucher not found
 */
router.get(
  "/code/:code",

  validate(voucherCodeValidation),
  voucherController.getVoucherByCode
);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   get:
 *     summary: Get voucher by ID
 *     tags: [Vouchers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Voucher ID
 *     responses:
 *       200:
 *         description: Voucher retrieved successfully
 *       404:
 *         description: Voucher not found
 */
router.get(
  "/:id",
  validate(voucherIdValidation),
  voucherController.getVoucherById
);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   put:
 *     summary: Update voucher by ID (Admin only)
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Voucher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               usageLimit:
 *                 type: number
 *               expireAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Voucher updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Voucher not found
 */
router.put(
  "/:id",
  authMiddleware(),
  authorizeAdminOrSeller(),

  validate(updateVoucherValidation),
  voucherController.updateVoucher
);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   delete:
 *     summary: Delete voucher by ID (Admin only)
 *     tags: [Vouchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Voucher ID
 *     responses:
 *       200:
 *         description: Voucher deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Voucher not found
 */
router.delete(
  "/:id",
  authMiddleware(),
  authorizeAdminOrSeller(),

  validate(voucherIdValidation),
  voucherController.deleteVoucher
);

export default router;

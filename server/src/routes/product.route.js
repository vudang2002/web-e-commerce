import express from "express";
import * as productController from "../controllers/product.controller.js";
import {
  authMiddleware,
  authorizeAdminOrSeller,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  productValidationRules,
  bulkProductValidationRules,
} from "../validators/product.validator.js";
import {
  checkOwnershipOrAdmin,
  checkBulkOwnershipOrAdmin,
} from "../middlewares/ownership.middleware.js";

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 */

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm (tìm trong tên và mô tả)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: ID của thương hiệu
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, price, name]
 *         description: Trường để sắp xếp
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Thứ tự sắp xếp (tăng dần/giảm dần)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số sản phẩm trên một trang
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Chỉ tìm sản phẩm còn hàng
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Products retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       description:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/products/bulk:
 *   post:
 *     summary: Create multiple products at once
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *     responses:
 *       200:
 *         description: Products created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/products/bulk-delete:
 *   delete:
 *     summary: Delete multiple products at once
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of product IDs to delete
 *     responses:
 *       200:
 *         description: Products deleted successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Access denied
 */

const router = express.Router();

router.get("/search", productController.searchProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/hot-deals", productController.getHotDealsProducts);
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/", productController.getProducts);

router.post(
  "/",
  authMiddleware(), // Cho phép cả admin và seller
  authorizeAdminOrSeller(),
  validate(productValidationRules),
  productController.createProduct
);

router.post(
  "/bulk",
  authMiddleware(), // Cho phép cả admin và seller
  authorizeAdminOrSeller(),
  validate(bulkProductValidationRules),
  productController.createBulkProducts
);

// Đặt route bulk-delete trước các route có tham số id để tránh xung đột
router.delete(
  "/bulk-delete",
  authMiddleware(),
  authorizeAdminOrSeller(),
  checkBulkOwnershipOrAdmin,
  productController.deleteBulkProducts
);

// Các route có tham số id phải đặt sau các route cố định
router.get("/:id", productController.getProductById);
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
  checkOwnershipOrAdmin,
  productController.toggleProductFeature
);

// Thêm route để kiểm tra stock availability
router.post("/check-stock", productController.checkStockAvailability);

export default router;

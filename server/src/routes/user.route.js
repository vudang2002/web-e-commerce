import express from "express";
import * as userController from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
import {
  registerValidationRules,
  loginValidationRules,
  updateUserValidationRules,
} from "../validators/user.validator.js";
import {
  authLimiter,
  createAccountLimiter,
  sensitiveApiLimiter,
} from "../middlewares/rate-limit.middleware.js";
import { uploadUserAvatar } from "../middlewares/upload.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
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
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
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
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

// Public routes
router.post(
  "/auth/register",
  createAccountLimiter, // Giới hạn tạo tài khoản để ngăn spam
  validate(registerValidationRules),
  userController.registerUser
);

router.post(
  "/auth/login",
  //authLimiter, // Giới hạn đăng nhập để ngăn brute force
  validate(loginValidationRules),
  userController.loginUser
);

// Protected routes
router.get(
  "/users",
  sensitiveApiLimiter, // Bảo vệ API admin
  authMiddleware("admin"),
  userController.getAllUsers
);
router.post(
  "/users",
  sensitiveApiLimiter,
  authMiddleware("admin"),
  uploadUserAvatar.single("avatar"), // Xử lý upload avatar
  validate(registerValidationRules),
  userController.registerUser // Sử dụng hàm registerUser hiện có để tạo user mới
);
router.get("/users/:id", authMiddleware(), userController.getUserById);
router.put(
  "/users/:id",
  authMiddleware(),
  validate(updateUserValidationRules),
  userController.updateUser
);
router.delete(
  "/users/:id",
  sensitiveApiLimiter, // Bảo vệ API xóa người dùng
  authMiddleware("admin", "self"),
  userController.deleteUser
);

// Profile routes
const profileValidationRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name cannot be empty"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email"),
];

router.put(
  "/auth/profile",
  authMiddleware(),
  profileValidationRules,
  validate(profileValidationRules),
  userController.updateProfile
);

router.put(
  "/auth/change-password",
  authMiddleware(),
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ],
  validate([
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ]),
  userController.changePassword
);

export default router;

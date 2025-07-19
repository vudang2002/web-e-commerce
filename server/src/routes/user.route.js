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
 *     description: Creates a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: John Doe
 *                 minLength: 2
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (min 6 characters)
 *                 example: "securePassword123"
 *                 minLength: 6
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 description: URL to user's avatar image (optional)
 *               isSeller:
 *                 type: boolean
 *                 description: Whether the user is a seller (optional)
 *                 default: false
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: User ID
 *                         name:
 *                           type: string
 *                           description: User's name
 *                         email:
 *                           type: string
 *                           description: User's email
 *                         avatar:
 *                           type: string
 *                           description: URL to user's avatar image
 *                         role:
 *                           type: string
 *                           description: User's role
 *                           enum: [user, admin, seller]
 *                         isSeller:
 *                           type: boolean
 *                           description: Whether the user is a seller
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                     token:
 *                       type: string
 *                       description: JWT authentication token
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Email already in use"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       param:
 *                         type: string
 *                       msg:
 *                         type: string
 *       429:
 *         description: Too many attempts, please try again later
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and returns a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: User logged in successfully
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: User ID
 *                         name:
 *                           type: string
 *                           description: User's name
 *                         email:
 *                           type: string
 *                           description: User's email
 *                         avatar:
 *                           type: string
 *                           description: URL to user's avatar image
 *                         role:
 *                           type: string
 *                           description: User's role
 *                           enum: [user, admin, seller]
 *                         isSeller:
 *                           type: boolean
 *                           description: Whether the user is a seller
 *                     token:
 *                       type: string
 *                       description: JWT authentication token
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid email or password"
 *       429:
 *         description: Too many login attempts, please try again later
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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

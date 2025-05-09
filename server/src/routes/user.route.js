import express from "express";
import * as userController from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";

const router = express.Router();

// Public routes
router.post(
  "/auth/register",
  validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ]),
  userController.registerUser
);

router.post(
  "/auth/login",
  validate([
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  userController.loginUser
);

// Protected routes
router.get("/users", authMiddleware("admin"), userController.getAllUsers);
router.get("/users/:id", authMiddleware(), userController.getUserById);
router.put(
  "/users/:id",
  authMiddleware(),
  validate([
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ]),
  userController.updateUser
);
router.delete(
  "/users/:id",
  authMiddleware("admin", "self"),
  userController.deleteUser
);

export default router;

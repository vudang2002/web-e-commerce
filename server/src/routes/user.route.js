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

const router = express.Router();

// Public routes
router.post(
  "/auth/register",
  validate(registerValidationRules),
  userController.registerUser
);

router.post(
  "/auth/login",
  validate(loginValidationRules),
  userController.loginUser
);

// Protected routes
router.get("/users", authMiddleware("admin"), userController.getAllUsers);
router.get("/users/:id", authMiddleware(), userController.getUserById);
router.put(
  "/users/:id",
  authMiddleware(),
  validate(updateUserValidationRules),
  userController.updateUser
);
router.delete(
  "/users/:id",
  authMiddleware("admin", "self"),
  userController.deleteUser
);

export default router;

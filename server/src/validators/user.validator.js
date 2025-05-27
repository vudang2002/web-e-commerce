import { body } from "express-validator";

export const registerValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["user", "admin", "staff"])
    .withMessage("Invalid role"),
  // Chuyển đổi boolean string thành boolean thực
  body("isSeller")
    .optional()
    .customSanitizer((value) => {
      if (value === "true" || value === true) return true;
      if (value === "false" || value === false) return false;
      return value;
    }),
  // Nếu là người bán, store name phải có
  body("storeName")
    .optional()
    .custom((value, { req }) => {
      if (req.body.isSeller === true || req.body.isSeller === "true") {
        if (!value) throw new Error("Store name is required for sellers");
      }
      return true;
    }),
  body("storeDescription").optional(),
];

export const loginValidationRules = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const updateUserValidationRules = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Invalid email"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

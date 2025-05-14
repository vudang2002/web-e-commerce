import express from "express";
import * as orderController from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createOrderValidationRules,
  updateOrderStatusValidationRules,
  markAsPaidValidationRules,
  refundOrderValidationRules,
} from "../validators/order.validator.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware(),
  validate(createOrderValidationRules),
  orderController.createOrder
);
router.get("/all", authMiddleware("admin"), orderController.getAllOrders);
router.get("/:id", authMiddleware(), orderController.getOrderById);
router.get("/", authMiddleware(), orderController.getUserOrders);
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

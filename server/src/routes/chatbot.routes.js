import express from "express";
import chatbotController from "../controllers/chatbot.controller.js";
import { body } from "express-validator";
import { handleValidationErrors } from "../middlewares/validation.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/chatbot/chat:
 *   post:
 *     summary: Chat với AI assistant
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Tin nhắn từ người dùng
 *               conversationHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                     content:
 *                       type: string
 *                 description: Lịch sử hội thoại
 *     responses:
 *       200:
 *         description: Phản hồi từ AI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 usage:
 *                   type: object
 */
router.post(
  "/chat",
  [
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Tin nhắn không được để trống")
      .isLength({ max: 1000 })
      .withMessage("Tin nhắn không được dài quá 1000 ký tự"),
    handleValidationErrors,
  ],
  chatbotController.chat
);

/**
 * @swagger
 * /api/chatbot/suggest:
 *   get:
 *     summary: Gợi ý sản phẩm
 *     tags: [Chatbot]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng sản phẩm gợi ý
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm gợi ý
 */
router.get("/suggest", chatbotController.suggestProducts);

/**
 * @swagger
 * /api/chatbot/status:
 *   get:
 *     summary: Kiểm tra trạng thái chatbot
 *     tags: [Chatbot]
 *     responses:
 *       200:
 *         description: Trạng thái chatbot
 */
router.get("/status", chatbotController.getStatus);

export default router;

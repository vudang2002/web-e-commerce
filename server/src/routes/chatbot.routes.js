import express from "express";
import chatbotController from "../controllers/chatbot.controller.js";
import { body } from "express-validator";
import { handleValidationErrors } from "../middlewares/validation.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/chatbot/chat:
 *   post:
 *     summary: Chat with AI assistant
 *     description: Send a message to the AI assistant and get a response based on conversation context
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: User message
 *                 example: "What are your bestselling products?"
 *               conversationHistory:
 *                 type: array
 *                 description: Previous conversation history for context
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                       description: Who sent the message
 *                     content:
 *                       type: string
 *                       description: Message content
 *                 example:
 *                   - role: "user"
 *                     content: "Hello"
 *                   - role: "assistant"
 *                     content: "Hi there! How can I help you with our products today?"
 *     responses:
 *       200:
 *         description: AI response
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
 *                     message:
 *                       type: string
 *                       description: AI assistant response
 *                       example: "Our bestselling products this month include the Ultra HD Smart TV, Premium Wireless Headphones, and Ergonomic Office Chair. Would you like more details about any of these products?"
 *                     usage:
 *                       type: object
 *                       properties:
 *                         promptTokens:
 *                           type: number
 *                           example: 45
 *                         completionTokens:
 *                           type: number
 *                           example: 73
 *                         totalTokens:
 *                           type: number
 *                           example: 118
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
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                   example:
 *                     - msg: "Message cannot be empty"
 *                       param: "message"
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error or AI service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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

import chatbotService from "../services/chatbot.service.js";

class ChatbotController {
  // Chat với AI
  async chat(req, res) {
    try {
      const { message, conversationHistory = [] } = req.body;

      if (!message || message.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Tin nhắn không được để trống",
        });
      }

      // Giới hạn lịch sử hội thoại để tránh context quá dài
      const limitedHistory = conversationHistory.slice(-10);

      const result = await chatbotService.chat(message, limitedHistory);

      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          usage: result.usage,
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.error,
        });
      }
    } catch (error) {
      console.error("Error in chat controller:", error);
      res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi xử lý tin nhắn",
      });
    }
  }
  // Gợi ý sản phẩm
  async suggestProducts(req, res) {
    try {
      const { query, limit = 5 } = req.query;
      console.log(
        "Suggest products controller - query:",
        query,
        "limit:",
        limit
      );

      const products = await chatbotService.suggestProducts(
        query,
        parseInt(limit)
      );
      console.log("Controller received products:", products.length);

      res.json({
        success: true,
        products,
        count: products.length,
      });
    } catch (error) {
      console.error("Error in suggest products controller:", error);
      res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi gợi ý sản phẩm",
      });
    }
  }

  // Lấy thông tin trạng thái chatbot
  async getStatus(req, res) {
    try {
      res.json({
        success: true,
        status: "active",
        message: "Chatbot đang hoạt động",
      });
    } catch (error) {
      console.error("Error in get status controller:", error);
      res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra",
      });
    }
  }
}

export default new ChatbotController();

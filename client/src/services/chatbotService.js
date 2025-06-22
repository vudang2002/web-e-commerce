import axiosClient from "../utils/axiosClient";

class ChatbotService {
  // Chat với AI
  async chat(message, conversationHistory = []) {
    try {
      const response = await axiosClient.post(
        "/chatbot/chat",
        {
          message,
          conversationHistory,
        },
        {
          timeout: 30000, // 30 seconds cho AI API
        }
      );
      return response;
    } catch (error) {
      console.error("Error in chatbot service:", error);

      // Return một object có cấu trúc chuẩn thay vì throw
      return {
        success: false,
        message:
          error.code === "ECONNABORTED"
            ? "Yêu cầu bị timeout. Vui lòng thử lại."
            : error.response?.data?.message || "Có lỗi xảy ra khi gửi tin nhắn",
      };
    }
  }
  // Gợi ý sản phẩm
  async suggestProducts(query, limit = 5) {
    try {
      const response = await axiosClient.get(`/chatbot/suggest`, {
        params: { query, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error in suggest products:", error);

      // Return empty result thay vì throw
      return {
        success: false,
        products: [],
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi gợi ý sản phẩm",
      };
    }
  }
  // Kiểm tra trạng thái chatbot
  async getStatus() {
    try {
      const response = await axiosClient.get("/chatbot/status");
      return response.data;
    } catch (error) {
      console.error("Error checking chatbot status:", error);

      return {
        success: false,
        status: "error",
        message:
          error.response?.data?.message || "Không thể kết nối với chatbot",
      };
    }
  }
}

export default new ChatbotService();

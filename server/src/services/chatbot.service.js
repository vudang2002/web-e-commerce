import { OpenAI } from "openai";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import config from "../config/env.config.js";

class ChatbotService {
  constructor() {
    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: config.OPENROUTER_API_KEY,
    });
  }
  // Lấy thông tin sản phẩm để cung cấp cho AI
  async getProductContext(searchQuery = "") {
    try {
      console.log("Getting product context for query:", searchQuery);
      let products;

      if (searchQuery) {
        // Tìm kiếm sản phẩm theo tên, description, tags
        products = await Product.find({
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { normalizedName: { $regex: searchQuery, $options: "i" } },
            { description: { $regex: searchQuery, $options: "i" } },
            { tags: { $in: [new RegExp(searchQuery, "i")] } },
          ],
          status: "active",
        })
          .populate("brand", "name")
          .populate("category", "name")
          .limit(10)
          .lean();

        console.log("Found products by search:", products.length);
      } else {
        // Lấy các sản phẩm nổi bật
        products = await Product.find({
          $or: [
            { isFeatured: true },
            { rating: { $gte: 4 } },
            { sold: { $gte: 10 } },
          ],
          status: "active",
        })
          .populate("brand", "name")
          .populate("category", "name")
          .limit(15)
          .lean();

        console.log("Found featured products:", products.length);
      }

      const result = products.map((product) => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        finalPrice: product.price * (1 - product.discount / 100),
        brand: product.brand?.name,
        category: product.category?.name,
        rating: product.rating,
        stock: product.stock,
        tags: product.tags,
        images: product.images?.[0], // Chỉ lấy ảnh đầu tiên
      }));

      console.log("Processed products:", result.length);
      return result;
    } catch (error) {
      console.error("Error getting product context:", error);
      return [];
    }
  }

  // Lấy danh mục để AI hiểu cấu trúc sản phẩm
  async getCategoryContext() {
    try {
      const categories = await Category.find({ status: "active" })
        .select("name description")
        .lean();

      return categories.map((cat) => ({
        name: cat.name,
        description: cat.description,
      }));
    } catch (error) {
      console.error("Error getting category context:", error);
      return [];
    }
  }

  // Tạo system message cho AI
  async createSystemMessage(userMessage) {
    const products = await this.getProductContext(userMessage);
    const categories = await this.getCategoryContext();

    return `Bạn là một trợ lý bán hàng thông minh cho cửa hàng trực tuyến. Nhiệm vụ của bạn là:

1. Tư vấn sản phẩm phù hợp với nhu cầu khách hàng
2. Cung cấp thông tin chi tiết về sản phẩm
3. So sánh sản phẩm 
4. Gợi ý sản phẩm liên quan
5. Trả lời các câu hỏi về chính sách mua hàng

DANH MỤC SẢN PHẨM HIỆN CÓ:
${categories.map((cat) => `- ${cat.name}: ${cat.description || ""}`).join("\n")}

SẢN PHẨM TRONG KHO (${products.length} sản phẩm):
${products
  .map(
    (product) =>
      `• ${product.name} (${product.brand} - ${product.category})
  - Giá: ${product.price.toLocaleString("vi-VN")}đ ${
        product.discount > 0
          ? `(Giảm ${product.discount}% = ${product.finalPrice.toLocaleString(
              "vi-VN"
            )}đ)`
          : ""
      }
  - Đánh giá: ${product.rating}/5 sao
  - Còn lại: ${product.stock} sản phẩm
  - Mô tả: ${product.description || "Không có mô tả"}
  ${product.tags?.length ? `- Tags: ${product.tags.join(", ")}` : ""}`
  )
  .join("\n\n")}

Hướng dẫn trả lời:
- Luôn trả lời bằng tiếng Việt
- Thân thiện, nhiệt tình và chuyên nghiệp
- Đưa ra gợi ý cụ thể dựa trên sản phẩm có sẵn
- Nếu không tìm thấy sản phẩm phù hợp, gợi ý sản phẩm tương tự
- Luôn đề xuất ít nhất 1-3 sản phẩm cụ thể
- Cung cấp thông tin đầy đủ: tên, giá, thương hiệu, đặc điểm nổi bật
- Nếu khách hỏi về chính sách, hãy trả lời chung chung và khuyên khách liên hệ để biết chi tiết`;
  }
  // Chat với AI
  async chat(userMessage, conversationHistory = []) {
    try {
      console.log("Chat request:", userMessage);
      const systemMessage = await this.createSystemMessage(userMessage);
      console.log("System message length:", systemMessage.length);

      const messages = [
        { role: "system", content: systemMessage },
        ...conversationHistory,
        { role: "user", content: userMessage },
      ];

      console.log("Sending to OpenRouter with", messages.length, "messages");
      const completion = await this.client.chat.completions.create({
        extra_headers: {
          "HTTP-Referer": config.SITE_URL,
          "X-Title": config.SITE_NAME,
        },
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      console.log("OpenRouter response received");
      return {
        success: true,
        message: completion.choices[0].message.content,
        usage: completion.usage,
      };
    } catch (error) {
      console.error("Error in chatbot service:", error);
      return {
        success: false,
        error: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.",
        details: error.message,
      };
    }
  }
  // Gợi ý sản phẩm dựa trên query
  async suggestProducts(query, limit = 5) {
    try {
      console.log("Suggest products for query:", query, "limit:", limit);
      const products = await this.getProductContext(query);
      console.log("Products found:", products.length);
      const result = products.slice(0, limit);
      console.log("Returning", result.length, "products");
      return result;
    } catch (error) {
      console.error("Error suggesting products:", error);
      return [];
    }
  }
}

export default new ChatbotService();

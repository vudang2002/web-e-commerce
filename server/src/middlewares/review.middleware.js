import Order from "../models/order.model.js";
import Review from "../models/review.model.js";

// Middleware kiểm tra quyền đánh giá sản phẩm
export const checkReviewPermission = async (req, res, next) => {
  try {
    const { product } = req.body;
    const userId = req.user._id;
    console.log("=== DEBUG REVIEW PERMISSION ===");
    console.log("Product ID:", product);
    console.log("User ID:", userId);

    // Tìm tất cả đơn hàng của user có chứa sản phẩm này
    const allOrders = await Order.find({
      user: userId,
      "orderItems.product": product,
    });

    console.log("All orders with this product:", allOrders.length);
    allOrders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        id: order._id,
        status: order.orderStatus,
        createdAt: order.createdAt,
      });
    }); // Kiểm tra xem user đã mua sản phẩm này chưa (cho phép cả Delivered và Completed)
    const order = await Order.findOne({
      user: userId,
      "orderItems.product": product,
      orderStatus: { $in: ["Delivered", "Completed"] }, // Cho phép cả 2 trạng thái
    });

    console.log("Found completed/delivered order:", order ? "YES" : "NO");
    console.log("Found completed order:", order ? "YES" : "NO");
    if (!order) {
      console.log("❌ Access denied: No completed/delivered order found");
      return res.status(403).json({
        success: false,
        message:
          "Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã hoàn thành hoặc đã giao",
      });
    }

    // Kiểm tra xem user đã đánh giá sản phẩm này chưa
    const existingReview = await Review.findOne({
      user: userId,
      product: product,
    });

    console.log("Existing review found:", existingReview ? "YES" : "NO");

    if (existingReview) {
      console.log("❌ Access denied: Review already exists");
      return res.status(400).json({
        success: false,
        message: "Bạn đã đánh giá sản phẩm này rồi",
      });
    }

    console.log("✅ Permission granted");
    next();
  } catch (error) {
    console.error("Error in checkReviewPermission:", error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi kiểm tra quyền đánh giá",
    });
  }
};

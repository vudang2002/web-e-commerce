import Order from "../models/order.model.js";
import Review from "../models/review.model.js";

// Middleware kiểm tra quyền đánh giá sản phẩm
export const checkReviewPermission = async (req, res, next) => {
  try {
    const { product } = req.body;
    const userId = req.user._id;

    // Kiểm tra xem user đã mua sản phẩm này chưa
    const order = await Order.findOne({
      user: userId,
      "orderItems.product": product,
      orderStatus: "Completed", // Chỉ có thể đánh giá khi đơn hàng đã hoàn thành
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message:
          "Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã hoàn thành",
      });
    }

    // Kiểm tra xem user đã đánh giá sản phẩm này chưa
    const existingReview = await Review.findOne({
      user: userId,
      product: product,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đánh giá sản phẩm này rồi",
      });
    }

    next();
  } catch (error) {
    console.error("Error in checkReviewPermission:", error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi kiểm tra quyền đánh giá",
    });
  }
};

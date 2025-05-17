// Middleware xử lý lỗi
const errorHandler = (err, req, res, next) => {
  // Xử lý theo từng loại lỗi
  if (err.name === "ValidationError") {
    // Mongoose validation error
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  if (err.code === 11000) {
    // MongoDB duplicate key error
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} đã tồn tại, vui lòng sử dụng ${field} khác.`,
    });
  }

  if (err.name === "CastError") {
    // Mongoose invalid ID error
    return res.status(400).json({
      success: false,
      message: `ID không hợp lệ: ${err.value}`,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ, vui lòng đăng nhập lại",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token đã hết hạn, vui lòng đăng nhập lại",
    });
  }

  // Lỗi mặc định
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  // Log lỗi server nhưng không gửi cho client trong môi trường production
  if (statusCode === 500) {
    console.error("Server Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

// Middleware xử lý lỗi 404
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
};

export { errorHandler, notFoundHandler };

// Middleware xử lý lỗi
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
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

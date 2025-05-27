import logger from "../utils/logger.util.js";
import { AppError } from "../utils/customError.util.js";
import { errorResponse, sendError } from "../utils/response.util.js";
import { HTTP_STATUS, ERROR_TYPES } from "../constants/index.js";
import config from "../config/env.config.js";

// Middleware xử lý lỗi
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  logger.error(`Error ${err.name}: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: req.user?.id || "anonymous",
  });

  // Handle custom AppError instances
  if (err instanceof AppError) {
    return sendError(res, err.message, null, err.statusCode);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
      value: e.value,
    }));

    return sendError(res, "Validation failed", errors, HTTP_STATUS.BAD_REQUEST);
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    return sendError(
      res,
      `${field} '${value}' already exists`,
      [{ field, message: `${field} must be unique`, value }],
      HTTP_STATUS.CONFLICT
    );
  }

  // Mongoose invalid ID error
  if (err.name === "CastError") {
    return sendError(
      res,
      `Invalid ${err.path}: ${err.value}`,
      [{ field: err.path, message: "Invalid ID format", value: err.value }],
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return sendError(
      res,
      "Invalid token, please login again",
      null,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  if (err.name === "TokenExpiredError") {
    return sendError(
      res,
      "Token expired, please login again",
      null,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  // Multer file upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return sendError(
      res,
      "File too large",
      [
        {
          message: `File size should not exceed ${
            config.MAX_FILE_SIZE / 1024 / 1024
          }MB`,
        },
      ],
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return sendError(
      res,
      "Unexpected file field",
      [{ message: "Invalid file field name" }],
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Rate limiting errors
  if (err.status === 429) {
    return sendError(
      res,
      "Too many requests, please try again later",
      null,
      429
    );
  }

  // Default server error
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message =
    config.NODE_ENV === "production" && statusCode === 500
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  // Log server errors with more details
  if (statusCode === 500) {
    logger.error("Unhandled Server Error:", {
      error: err,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
    });
  }

  const response = errorResponse(message, null, {
    ...(config.NODE_ENV !== "production" && { stack: err.stack }),
    type: ERROR_TYPES.INTERNAL_SERVER_ERROR,
    timestamp: new Date().toISOString(),
  });

  res.status(statusCode).json(response);
};

// Middleware xử lý lỗi 404
const notFoundHandler = (req, res, next) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  sendError(
    res,
    `Route ${req.originalUrl} not found`,
    [
      {
        message: "The requested resource does not exist",
        path: req.originalUrl,
        method: req.method,
      },
    ],
    HTTP_STATUS.NOT_FOUND
  );
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { errorHandler, notFoundHandler, asyncHandler };

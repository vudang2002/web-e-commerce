import { HTTP_STATUS, ERROR_TYPES } from "../constants/index.js";

// Base custom error class
export class AppError extends Error {
  constructor(
    message,
    statusCode,
    type = ERROR_TYPES.VALIDATION_ERROR,
    isOperational = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation Error
export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_TYPES.VALIDATION_ERROR);
    this.errors = errors;
  }
}

// Authentication Error
export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_TYPES.AUTHENTICATION_ERROR);
  }
}

// Authorization Error
export class AuthorizationError extends AppError {
  constructor(message = "Access denied") {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_TYPES.AUTHORIZATION_ERROR);
  }
}

// Not Found Error
export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(
      `${resource} not found`,
      HTTP_STATUS.NOT_FOUND,
      ERROR_TYPES.NOT_FOUND_ERROR
    );
  }
}

// Duplicate Error
export class DuplicateError extends AppError {
  constructor(field) {
    super(
      `${field} already exists`,
      HTTP_STATUS.CONFLICT,
      ERROR_TYPES.DUPLICATE_ERROR
    );
  }
}

// Insufficient Stock Error
export class InsufficientStockError extends AppError {
  constructor(productName, requested, available) {
    super(
      `Insufficient stock for ${productName}. Requested: ${requested}, Available: ${available}`,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_TYPES.INSUFFICIENT_STOCK
    );
    this.productName = productName;
    this.requested = requested;
    this.available = available;
  }
}

// Product Inactive Error
export class ProductInactiveError extends AppError {
  constructor(productName) {
    super(
      `Product "${productName}" is currently inactive`,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_TYPES.PRODUCT_INACTIVE
    );
    this.productName = productName;
  }
}

// Database Error
export class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, "DATABASE_ERROR");
  }
}

// External Service Error
export class ExternalServiceError extends AppError {
  constructor(service, message = "External service error") {
    super(
      `${service}: ${message}`,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "EXTERNAL_SERVICE_ERROR"
    );
    this.service = service;
  }
}

// Rate Limit Error
export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429, "RATE_LIMIT_ERROR");
  }
}

// File Upload Error
export class FileUploadError extends AppError {
  constructor(message = "File upload failed") {
    super(message, HTTP_STATUS.BAD_REQUEST, "FILE_UPLOAD_ERROR");
  }
}

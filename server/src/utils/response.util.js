import { HTTP_STATUS } from "../constants/index.js";

/**
 * Create a standardized API response
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - Response message
 * @param {any} data - Response data
 * @param {object} meta - Additional metadata (pagination, etc.)
 * @param {array} errors - Array of error details
 * @returns {object} Formatted response object
 */
export const createResponse = (
  success = true,
  message = "",
  data = null,
  meta = null,
  errors = null
) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  if (errors !== null) {
    response.errors = errors;
  }

  return response;
};

/**
 * Create a success response
 * @param {string} message - Success message
 * @param {any} data - Response data
 * @param {object} meta - Additional metadata
 * @returns {object} Success response
 */
export const successResponse = (
  message = "Operation successful",
  data = null,
  meta = null
) => {
  return createResponse(true, message, data, meta);
};

/**
 * Create an error response
 * @param {string} message - Error message
 * @param {array} errors - Array of error details
 * @param {any} data - Additional data (optional)
 * @returns {object} Error response
 */
export const errorResponse = (
  message = "Operation failed",
  errors = null,
  data = null
) => {
  return createResponse(false, message, data, null, errors);
};

/**
 * Create a paginated response
 * @param {array} data - Array of data items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @param {string} message - Response message
 * @returns {object} Paginated response
 */
export const paginatedResponse = (
  data,
  page,
  limit,
  total,
  message = "Data retrieved successfully"
) => {
  const totalPages = Math.ceil(total / limit);

  const meta = {
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total),
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };

  return createResponse(true, message, data, meta);
};

/**
 * Create a validation error response
 * @param {array} validationErrors - Array of validation errors
 * @param {string} message - Error message
 * @returns {object} Validation error response
 */
export const validationErrorResponse = (
  validationErrors,
  message = "Validation failed"
) => {
  const errors = validationErrors.map((error) => ({
    field: error.path || error.param,
    message: error.msg || error.message,
    value: error.value,
  }));

  return createResponse(false, message, null, null, errors);
};

/**
 * Send a standardized JSON response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {object} responseData - Response data object
 */
export const sendResponse = (
  res,
  statusCode = HTTP_STATUS.OK,
  responseData
) => {
  return res.status(statusCode).json(responseData);
};

/**
 * Send a success response
 * @param {object} res - Express response object
 * @param {string} message - Success message
 * @param {any} data - Response data
 * @param {object} meta - Additional metadata
 * @param {number} statusCode - HTTP status code
 */
export const sendSuccess = (
  res,
  message,
  data = null,
  meta = null,
  statusCode = HTTP_STATUS.OK
) => {
  const response = successResponse(message, data, meta);
  return sendResponse(res, statusCode, response);
};

/**
 * Send an error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {array} errors - Array of error details
 * @param {number} statusCode - HTTP status code
 * @param {any} data - Additional data
 */
export const sendError = (
  res,
  message,
  errors = null,
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  data = null
) => {
  const response = errorResponse(message, errors, data);
  return sendResponse(res, statusCode, response);
};

/**
 * Send a paginated response
 * @param {object} res - Express response object
 * @param {array} data - Array of data items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @param {string} message - Response message
 * @param {number} statusCode - HTTP status code
 */
export const sendPaginated = (
  res,
  data,
  page,
  limit,
  total,
  message,
  statusCode = HTTP_STATUS.OK
) => {
  const response = paginatedResponse(data, page, limit, total, message);
  return sendResponse(res, statusCode, response);
};

// Legacy function for backward compatibility
export const formatResponse = (success, message, data, meta) => {
  return createResponse(success, message, data, meta);
};

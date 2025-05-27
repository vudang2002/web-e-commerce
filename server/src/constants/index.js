// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  SELLER: "seller",
  CUSTOMER: "customer",
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  OUT_OF_STOCK: "out-of-stock",
};

// Order Status
export const ORDER_STATUS = {
  PROCESSING: "Processing",
  CONFIRMED: "Confirmed",
  SHIPPING: "Shipping",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  FAILED: "Failed",
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: "COD",
  ONLINE: "Online",
};

// Error Types
export const ERROR_TYPES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  DUPLICATE_ERROR: "DUPLICATE_ERROR",
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
  PRODUCT_INACTIVE: "PRODUCT_INACTIVE",
};

// Cache Keys
export const CACHE_KEYS = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  BRANDS: "brands",
  FEATURED_PRODUCTS: "featured_products",
};

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
};

// File Upload
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES_PER_PRODUCT: 10,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PRODUCT_NAME_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 2000,
  MAX_QUANTITY_PER_ORDER: 100,
};

// Email Templates
export const EMAIL_TEMPLATES = {
  WELCOME: "welcome",
  ORDER_CONFIRMATION: "order_confirmation",
  PASSWORD_RESET: "password_reset",
  ORDER_STATUS_UPDATE: "order_status_update",
};

// Rate Limiting
export const RATE_LIMITS = {
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
  },
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
  },
  UPLOAD: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 uploads per minute
  },
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10,11}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  MONGODB_ID: /^[0-9a-fA-F]{24}$/,
};

// Default Values
export const DEFAULTS = {
  SHIPPING_PRICE: 10,
  PRODUCT_RATING: 0,
  PRODUCT_REVIEWS: 0,
  USER_AVATAR: "/images/default-avatar.png",
  PRODUCT_IMAGE: "/images/default-product.png",
};

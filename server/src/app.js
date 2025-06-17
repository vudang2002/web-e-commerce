import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import config from "./config/env.config.js";
import logger from "./utils/logger.util.js";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import brandRoutes from "./routes/brand.route.js";
import reviewRoutes from "./routes/review.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import uploadRoutes from "./routes/upload.route.js";
import voucherRoutes from "./routes/voucher.route.js";
import healthRoutes from "./routes/health.route.js";
import searchRoutes from "./routes/search.route.js";
import setupSwagger from "./swagger.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import {
  globalLimiter,
  authLimiter,
  sensitiveApiLimiter,
} from "./middlewares/rate-limit.middleware.js";

const app = express();

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set("trust proxy", 1);

// Compression middleware for better performance
app.use(compression());

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // Disable for development
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS configuration using environment config
app.use(
  cors({
    origin:
      config.NODE_ENV === "production"
        ? [
            "https://your-frontend-domain.com",
            "https://admin.your-frontend-domain.com",
          ]
        : [
            config.CORS_ORIGIN,
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:5174",
          ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    exposedHeaders: ["x-total-count", "x-pagination"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// HTTP request logging with Winston
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", { stream: logger.stream }));
}

// Rate limiting
//app.use("/api", globalLimiter);

// Health check routes (should be before other routes)
app.use("/api/health", healthRoutes);

// API documentation
setupSwagger(app);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-commerce API is running",
    version: "1.0.0",
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/search", searchRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown handling
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

// Unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Uncaught exception
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

export default app;

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import brandRoutes from "./routes/brand.route.js";
import reviewRoutes from "./routes/review.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import uploadRoutes from "./routes/upload.route.js";
import setupSwagger from "./swagger.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import {
  globalLimiter,
  authLimiter,
  sensitiveApiLimiter,
} from "./middlewares/rate-limit.middleware.js";

const app = express();

// Sử dụng Helmet để bảo vệ HTTP headers
app.use(helmet());

// Cấu hình CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://your-frontend-domain.com",
            "https://admin.your-frontend-domain.com",
          ]
        : ["http://localhost:5173", "http://localhost:3000"], // Chỉ cho phép các origin cụ thể
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Các phương thức được phép
    credentials: true, // Cho phép gửi cookie hoặc thông tin xác thực
    exposedHeaders: ["x-total-count", "x-pagination"], // Cho phép frontend đọc các header pagination
  })
);

app.use(express.json());

// Sử dụng morgan để log request
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Áp dụng rate limiter cho toàn bộ API
app.use("/api", globalLimiter);

// Cấu hình Swagger
setupSwagger(app);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

// Middleware xử lý lỗi 404
app.use(notFoundHandler);

// Middleware xử lý lỗi chung
app.use(errorHandler);

export default app;

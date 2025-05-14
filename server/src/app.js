import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import brandRoutes from "./routes/brand.route.js";
import reviewRoutes from "./routes/review.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import setupSwagger from "./swagger.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

// Cấu hình CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức được phép
    credentials: true, // Cho phép gửi cookie hoặc thông tin xác thực
  })
);

app.use(express.json());

// Sử dụng morgan để log request
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

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

// Middleware xử lý lỗi 404
app.use(notFoundHandler);

// Middleware xử lý lỗi chung
app.use(errorHandler);

export default app;

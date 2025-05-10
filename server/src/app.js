import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import brandRoutes from "./routes/brand.route.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Use user routes
app.use("/api", userRoutes);

// Use product routes
app.use("/api/products", productRoutes);

// Use category routes
app.use("/api/categories", categoryRoutes);

// Use brand routes
app.use("/api/brands", brandRoutes);

export default app;

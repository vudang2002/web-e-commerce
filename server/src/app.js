import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Use user routes
app.use("/api", userRoutes);

export default app;

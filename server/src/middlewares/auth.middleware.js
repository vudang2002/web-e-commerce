import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, message: "Access token is missing" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }

      req.user = user; // Nếu có yêu cầu role thì kiểm tra
      if (
        requiredRole &&
        user.role !== requiredRole &&
        user._id.toString() !== req.params.id
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  };
};

// Chỉ cho admin hoặc seller truy cập
export const authorizeAdminOrSeller = () => {
  return (req, res, next) => {
    if (req.user?.role === "admin" || req.user?.isSeller) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: "Access denied. Only admin or sellers are allowed.",
    });
  };
};

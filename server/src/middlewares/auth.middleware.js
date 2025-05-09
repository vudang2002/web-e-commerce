import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Access token is missing" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }

      if (
        requiredRole &&
        req.user.role !== requiredRole &&
        req.user._id.toString() !== req.params.id
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }

      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  };
};

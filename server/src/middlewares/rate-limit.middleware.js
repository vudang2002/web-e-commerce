import rateLimit from "express-rate-limit";
import { formatResponse } from "../utils/response.util.js";

// Giới hạn chung cho tất cả các API requests
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn mỗi IP chỉ được gọi 100 request trong 15 phút
  standardHeaders: true, // Trả về thông tin rate limit trong tiêu đề `RateLimit-*`
  legacyHeaders: false, // Tắt các tiêu đề `X-RateLimit-*`
  message: formatResponse(
    false,
    "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút"
  ),
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

// Giới hạn cho các API liên quan đến authentication
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5, // Giới hạn 5 lần đăng nhập sai trong 1 giờ
  standardHeaders: true,
  legacyHeaders: false,
  message: formatResponse(
    false,
    "Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 1 giờ"
  ),
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

// Giới hạn cho API tạo tài khoản
export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 3, // Giới hạn tạo 3 tài khoản trong 1 giờ
  standardHeaders: true,
  legacyHeaders: false,
  message: formatResponse(
    false,
    "Quá nhiều tài khoản được tạo từ IP này, vui lòng thử lại sau 1 giờ"
  ),
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

// Giới hạn cho các API nhạy cảm như API quản trị
export const sensitiveApiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 phút
  max: 2000, // Giới hạn 2000 request trong 10 phút
  standardHeaders: true,
  legacyHeaders: false,
  message: formatResponse(
    false,
    "Quá nhiều yêu cầu tới API nhạy cảm, vui lòng thử lại sau"
  ),
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

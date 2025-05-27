import { validationResult } from "express-validator";

export const validate = (validations) => {
  return async (req, res, next) => {
    console.log("Validating request body:", JSON.stringify(req.body)); // Log dữ liệu từ request body chi tiết hơn
    console.log("Request headers:", req.headers); // Log headers

    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array()); // Log lỗi validation
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  };
};

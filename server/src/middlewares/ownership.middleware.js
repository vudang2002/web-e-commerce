import Product from "../models/product.model.js";

export const checkOwnershipOrAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the user is the owner or an admin
    if (
      req.user.role === "admin" ||
      product.owner.toString() === req.user._id
    ) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. You are not authorized to update this product.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking ownership.",
    });
  }
};

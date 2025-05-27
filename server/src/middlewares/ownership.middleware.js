import Product from "../models/product.model.js";
import mongoose from "mongoose";

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
      product.owner.toString() === req.user._id.toString()
    ) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. You are not authorized to update this product.",
    });
  } catch (error) {
    console.error("Error in checkOwnershipOrAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking ownership.",
    });
  }
};

export const checkBulkOwnershipOrAdmin = async (req, res, next) => {
  try {
    console.log("=== OWNERSHIP CHECK STARTED ===");
    console.log("Request body:", req.body);
    console.log("User info:", {
      id: req.user._id,
      idString: req.user._id.toString(),
      role: req.user.role,
    });

    const { productIds } = req.body || {};

    // Check if productIds exists and is an array
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid product IDs array is required",
      });
    }

    console.log("Product IDs to check:", productIds);

    // If user is admin, allow the operation without checking ownership
    if (req.user.role === "admin") {
      console.log("User is admin, skipping ownership check");
      return next();
    }

    // Convert all IDs to strings for safer comparison
    const productIdStrings = productIds.map((id) => String(id));
    console.log("Product IDs as strings:", productIdStrings);

    // Create valid ObjectIds for MongoDB query
    let validObjectIds = [];
    try {
      validObjectIds = productIdStrings.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      console.log("Valid ObjectIds created for query");
    } catch (err) {
      console.error("Error creating ObjectIds:", err);
      return res.status(400).json({
        success: false,
        message: "Some product IDs are not valid MongoDB ObjectIds",
      });
    }

    // Find products using the valid IDs
    const products = await Product.find({
      _id: { $in: validObjectIds },
    })
      .select("_id owner")
      .lean();

    console.log(
      `Products found: ${products.length} out of ${productIdStrings.length}`
    );

    // Check if all products were found
    if (products.length < productIdStrings.length) {
      const foundIds = products.map((p) => p._id.toString());
      const missingIds = productIdStrings.filter(
        (id) => !foundIds.includes(id)
      );
      console.log("Missing product IDs:", missingIds);

      return res.status(404).json({
        success: false,
        message: `${
          missingIds.length
        } products were not found: ${missingIds.join(", ")}`,
      });
    }

    // Check ownership - straightforward comparison
    const userIdStr = req.user._id.toString();
    console.log("User ID for comparison:", userIdStr);

    const unauthorizedProducts = [];

    for (const product of products) {
      const ownerId = product.owner ? product.owner.toString() : null;
      console.log(`Product ${product._id}: owner=${ownerId}`);

      if (ownerId !== userIdStr) {
        unauthorizedProducts.push(product);
        console.log(`Unauthorized access for product: ${product._id}`);
      }
    }

    if (unauthorizedProducts.length > 0) {
      const unauthorizedIds = unauthorizedProducts.map((p) => p._id.toString());
      console.log("Unauthorized product IDs:", unauthorizedIds);

      return res.status(403).json({
        success: false,
        message: `Access denied. You are not authorized to delete ${unauthorizedProducts.length} of these products.`,
      });
    }

    // User owns all products
    console.log("Authorization successful. User owns all products.");
    console.log("=== OWNERSHIP CHECK COMPLETED ===");
    next();
  } catch (error) {
    console.error("Error in checkBulkOwnershipOrAdmin:", error);
    console.error("Stack trace:", error.stack);
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking ownership.",
    });
  }
};

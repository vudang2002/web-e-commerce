import * as productService from "../services/product.service.js";
import { formatResponse } from "../utils/response.util.js";
import cache from "../utils/cache.util.js";
import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({
        success: false,
        message: "User information is required to create a product",
      });
    }

    const product = await productService.createProduct({
      ...req.body,
      owner: req.user._id, // Gán owner là người tạo sản phẩm
    });

    res.json(formatResponse(true, "Product created successfully", product));
  } catch (error) {
    res.status(500).json(formatResponse(false, error.message));
  }
};

// New method for bulk product creation
export const createBulkProducts = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({
        success: false,
        message: "User information is required to create products",
      });
    }

    // Check if body is an array
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Request body should be an array of products",
      });
    }

    // Add owner to each product
    const productsWithOwner = req.body.map((product) => ({
      ...product,
      owner: req.user._id,
    }));

    // Create all products
    const products = await productService.createBulkProducts(productsWithOwner);

    res.json(
      formatResponse(
        true,
        `${products.length} products created successfully`,
        products
      )
    );
  } catch (error) {
    res.status(500).json(formatResponse(false, error.message));
  }
};

export const getProducts = async (req, res) => {
  try {
    const { filter, ...options } = req.query;

    // Parse filter from JSON string if provided
    let parsedFilter = {};
    if (filter) {
      try {
        parsedFilter = JSON.parse(filter);
      } catch (e) {
        // If filter is not JSON, treat it as empty filter
        console.warn("Invalid filter JSON:", filter);
        parsedFilter = {};
      }
    }

    const result = await productService.getProducts(parsedFilter, options);
    res.json(formatResponse(true, "Products fetched successfully", result));
  } catch (error) {
    res.status(500).json(formatResponse(false, error.message));
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product)
      return res.status(404).json(formatResponse(false, "Product not found"));
    res.json(formatResponse(true, "Product fetched successfully", product));
  } catch (error) {
    res.status(500).json(formatResponse(false, error.message));
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    if (!product)
      return res.status(404).json(formatResponse(false, "Product not found"));
    res.json(formatResponse(true, "Product fetched successfully", product));
  } catch (error) {
    res.status(500).json(formatResponse(false, error.message));
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await productService.getFeaturedProducts();
    res.json(
      formatResponse(true, "Featured products fetched successfully", products)
    );
  } catch (error) {
    res.status(500).json(formatResponse(false, error.message));
  }
};

/**
 * Tìm kiếm sản phẩm với nhiều tiêu chí lọc
 * @route GET /api/products/search
 */
export const searchProducts = async (req, res) => {
  try {
    // Kiểm tra input
    const page = parseInt(req.query.page) || 1;
    if (page < 1) {
      return res
        .status(400)
        .json(formatResponse(false, "Số trang không hợp lệ"));
    }

    const limit = parseInt(req.query.limit) || 10;
    if (limit < 1 || limit > 50) {
      return res
        .status(400)
        .json(
          formatResponse(false, "Số lượng sản phẩm mỗi trang phải từ 1-50")
        );
    }

    // Tạo cache key từ query parameters
    const cacheKey = `search-${JSON.stringify(req.query)}`;

    // Kiểm tra xem đã có kết quả trong cache chưa
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log("Trả về kết quả từ cache");
      return res.json(
        formatResponse(
          true,
          "Products retrieved from cache",
          cachedResult.products,
          cachedResult.pagination
        )
      );
    }

    // Nếu không có cache, thực hiện tìm kiếm
    const result = await productService.searchProducts(req.query);

    // Lưu kết quả vào cache trong 60 giây
    cache.set(cacheKey, result);

    // Trả về kết quả
    res.json(
      formatResponse(
        true,
        "Products retrieved successfully",
        result.products,
        result.pagination
      )
    );
  } catch (error) {
    console.error("Search products error:", error);
    res
      .status(500)
      .json(formatResponse(false, "Đã xảy ra lỗi khi tìm kiếm sản phẩm"));
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product)
      return res.status(404).json(formatResponse(false, "Product not found"));
    res.json(formatResponse(true, "Product updated successfully", product));
  } catch (error) {
    res.status(500).json(formatResponse(false, error.message));
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product)
      return res.status(404).json(formatResponse(false, "Product not found"));
    res.json(formatResponse(true, "Product deleted successfully"));
  } catch (error) {
    res.status(500).json(formatResponse(false, error.message));
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const product = await productService.updateProductStatus(
      req.params.id,
      req.body.status
    );
    if (!product)
      return res.status(404).json(formatResponse(false, "Product not found"));
    res.json(
      formatResponse(true, "Product status updated successfully", product)
    );
  } catch (error) {
    res.status(500).json(formatResponse(false, error.message));
  }
};

export const toggleProductFeature = async (req, res) => {
  try {
    const product = await productService.toggleProductFeature(
      req.params.id,
      req.body.isFeatured
    );
    if (!product)
      return res.status(404).json(formatResponse(false, "Product not found"));
    res.json(
      formatResponse(
        true,
        "Product feature status updated successfully",
        product
      )
    );
  } catch (error) {
    res.status(500).json(formatResponse(false, error.message));
  }
};

export const deleteBulkProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res
        .status(400)
        .json(formatResponse(false, "Product IDs array is required"));
    }

    const isAdmin = req.user.role === "admin";
    const result = await productService.deleteBulkProducts(
      productIds,
      req.user._id,
      isAdmin
    );

    // If no products were deleted
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json(
          formatResponse(
            false,
            "No products were deleted. Check if products exist or you have permission."
          )
        );
    }

    // If some products couldn't be deleted (due to permissions or they don't exist)
    if (result.deletedCount < result.requestedCount) {
      return res.json(
        formatResponse(
          true,
          `Partially completed. ${result.deletedCount} out of ${result.requestedCount} products were deleted. You may not have permission to delete some products.`
        )
      );
    }

    // All products deleted successfully
    res.json(
      formatResponse(
        true,
        `Successfully deleted ${result.deletedCount} products`
      )
    );
  } catch (error) {
    res.status(500).json(formatResponse(false, error.message));
  }
};

// Kiểm tra stock availability cho nhiều sản phẩm
export const checkStockAvailability = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity }]

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Items must be provided as an array",
      });
    }

    const stockInfo = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).select(
        "name stock status sold"
      );

      if (!product) {
        stockInfo.push({
          productId: item.productId,
          available: false,
          reason: "Product not found",
        });
        continue;
      }

      const isAvailable =
        product.status === "active" && product.stock >= item.quantity;

      stockInfo.push({
        productId: item.productId,
        productName: product.name,
        requestedQuantity: item.quantity,
        availableStock: product.stock,
        sold: product.sold,
        status: product.status,
        available: isAvailable,
        reason: !isAvailable
          ? product.status !== "active"
            ? "Product inactive"
            : "Insufficient stock"
          : null,
      });
    }

    res.json({
      success: true,
      data: stockInfo,
    });
  } catch (error) {
    console.error("Check stock error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking stock availability",
    });
  }
};

export const getHotDealsProducts = async (req, res) => {
  try {
    const discount = parseInt(req.query.discount_gte) || 40;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || "-discount";

    const result = await productService.getHotDeals(discount, {
      page,
      limit,
      sort,
    });

    // Trả về đúng định dạng cho client: data là object có thuộc tính products
    const response = formatResponse(
      true,
      "Hot deals products fetched successfully",
      { products: result.products },
      result.pagination
    );
    res.json(response);
  } catch (error) {
    console.error("[getHotDealsProducts] Error:", error);
    res.status(500).json(formatResponse(false, error.message));
  }
};

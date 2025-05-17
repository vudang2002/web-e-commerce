import * as productService from "../services/product.service.js";
import { formatResponse } from "../utils/response.util.js";
import cache from "../utils/cache.util.js";

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

export const getProducts = async (req, res) => {
  try {
    const { filter, ...options } = req.query;
    const result = await productService.getProducts(filter, options);
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

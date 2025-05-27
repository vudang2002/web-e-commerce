// File: services/product.service.js
import Product from "../models/product.model.js";
import slugify from "slugify";

export const createProduct = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new Error("Invalid product data provided");
    }

    console.log("[createProduct] Creating product with:", data);

    const product = new Product(data);
    const savedProduct = await product.save();
    console.log("[createProduct] Product created successfully:", savedProduct);
    return savedProduct;
  } catch (error) {
    console.error("[createProduct] Error:", error);
    throw error;
  }
};

// New method for bulk product creation
export const createBulkProducts = async (productsData) => {
  try {
    if (!Array.isArray(productsData) || productsData.length === 0) {
      throw new Error("Invalid products data provided");
    }

    console.log(
      `[createBulkProducts] Creating ${productsData.length} products`
    );

    // Process each product to add a slug
    const processedProducts = productsData.map((product) => {
      // Generate a unique slug for each product
      const timestamp = Date.now() + Math.floor(Math.random() * 1000); // Add randomness to ensure uniqueness
      const slug = `${slugify(product.name, {
        lower: true,
        strict: true,
      })}-${timestamp}`;

      return {
        ...product,
        slug,
      };
    });

    // Create all products in one operation
    const products = await Product.insertMany(processedProducts, {
      ordered: false,
    });

    console.log(
      `[createBulkProducts] ${products.length} products created successfully`
    );
    return products;
  } catch (error) {
    console.error("[createBulkProducts] Error:", error);
    throw error;
  }
};

export const getProducts = async (filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = "-createdAt" } = options;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return { products, total, page, limit };
};

export const getProductById = async (id) => {
  return await Product.findById(id).lean();
};

export const getProductBySlug = async (slug) => {
  return await Product.findOne({ slug }).lean();
};

export const getFeaturedProducts = async () => {
  return await Product.find({ isFeatured: true }).lean();
};

export const updateProduct = async (id, data) => {
  if (!id || !data) throw new Error("Missing update data");
  return await Product.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const searchProducts = async (queryParams) => {
  try {
    // Chỉ giữ lại các tham số tìm kiếm phổ biến và đơn giản
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
      inStock = false,
    } = queryParams;

    // Xây dựng query filter
    const filter = {};

    // Tìm kiếm theo từ khóa trong tên và mô tả sản phẩm
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Lọc theo category
    if (category) {
      filter.category = category;
    }

    // Lọc theo brand
    if (brand) {
      filter.brand = brand;
    }

    // Lọc theo khoảng giá
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    // Chỉ lấy sản phẩm còn hàng nếu có yêu cầu
    if (inStock === true || inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    // Cấu hình sắp xếp đơn giản
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Phân trang
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitValue = parseInt(limit);

    // Truy vấn database
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("brand", "name slug logo") // Populate thông tin brand
        .populate("category", "name slug image") // Populate thông tin category
        .sort(sort)
        .skip(skip)
        .limit(limitValue)
        .lean(), // Chuyển đổi từ mongoose document sang plain javascript object
      Product.countDocuments(filter),
    ]);

    // Tính toán thông tin phân trang đơn giản
    const totalPages = Math.ceil(total / limitValue);

    return {
      products,
      pagination: {
        total,
        limit: limitValue,
        page: parseInt(page),
        totalPages,
      },
    };
  } catch (error) {
    console.error("[searchProducts] Error:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export const updateProductStatus = async (id, status) => {
  if (!id || !status) throw new Error("Missing product status");
  return await Product.findByIdAndUpdate(id, { status }, { new: true }).lean();
};

export const toggleProductFeature = async (id, isFeatured) => {
  if (typeof isFeatured !== "boolean")
    throw new Error("Invalid isFeatured value");
  return await Product.findByIdAndUpdate(
    id,
    { isFeatured },
    { new: true }
  ).lean();
};

// Bulk delete products by IDs
export const deleteBulkProducts = async (productIds, userId, isAdmin) => {
  try {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error("Invalid product IDs provided");
    }

    console.log(
      `[deleteBulkProducts] Attempting to delete ${productIds.length} products`
    );

    // We don't need to filter by owner here anymore since the middleware already checked
    // that the user either owns all the products or is an admin
    let deleteFilter = { _id: { $in: productIds } };

    const result = await Product.deleteMany(deleteFilter);

    console.log(`[deleteBulkProducts] Deleted ${result.deletedCount} products`);

    return {
      deletedCount: result.deletedCount,
      requestedCount: productIds.length,
    };
  } catch (error) {
    console.error("[deleteBulkProducts] Error:", error);
    throw error;
  }
};

// File: services/product.service.js
import Product from "../models/product.model.js";

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

import Brand from "../models/brand.model.js";

export const getBrands = async () => {
  return await Brand.find();
};

export const getBrandById = async (id) => {
  return await Brand.findById(id);
};

export const getBrandBySlug = async (slug) => {
  return await Brand.findOne({ slug });
};

export const createBrand = async (brandData) => {
  return await Brand.create(brandData);
};

export const updateBrand = async (id, brandData) => {
  return await Brand.findByIdAndUpdate(id, brandData, { new: true });
};

export const deleteBrand = async (id) => {
  return await Brand.findByIdAndDelete(id);
};

// Thêm mới: Xóa nhiều nhãn hàng cùng lúc
export const deleteBulkBrands = async (brandIds) => {
  try {
    if (!Array.isArray(brandIds) || brandIds.length === 0) {
      throw new Error("Danh sách ID nhãn hàng không hợp lệ");
    }

    console.log(
      `[deleteBulkBrands] Đang cố gắng xóa ${brandIds.length} nhãn hàng`
    );

    const deleteFilter = { _id: { $in: brandIds } };
    const result = await Brand.deleteMany(deleteFilter);

    console.log(`[deleteBulkBrands] Đã xóa ${result.deletedCount} nhãn hàng`);

    return {
      deletedCount: result.deletedCount,
      requestedCount: brandIds.length,
    };
  } catch (error) {
    console.error("[deleteBulkBrands] Lỗi:", error);
    throw error;
  }
};

// Thêm mới: Lấy danh sách brands theo categoryId
export const getBrandsByCategory = async (categoryId) => {
  return await Brand.find({ categories: categoryId });
};

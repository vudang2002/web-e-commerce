import * as brandService from "../services/brand.service.js";
import { createResponse } from "../utils/response.util.js";

export const getBrands = async (req, res) => {
  const { categoryId } = req.query;

  // Nếu có categoryId trong query, trả về brands theo category
  if (categoryId) {
    const brands = await brandService.getBrandsByCategory(categoryId);
    return res.json(createResponse(brands));
  }

  // Nếu không có categoryId, trả về tất cả brands
  const brands = await brandService.getBrands();
  res.json(createResponse(brands));
};

export const getBrandById = async (req, res) => {
  const { id } = req.params;
  const brand = await brandService.getBrandById(id);
  res.json(createResponse(brand));
};

export const getBrandBySlug = async (req, res) => {
  const { slug } = req.params;
  const brand = await brandService.getBrandBySlug(slug);

  if (!brand) {
    return res.status(404).json({
      success: false,
      message: "Brand not found",
    });
  }

  res.json(createResponse(brand));
};

export const createBrand = async (req, res) => {
  const brandData = req.body;
  const newBrand = await brandService.createBrand(brandData);
  res.status(201).json(createResponse(newBrand));
};

export const updateBrand = async (req, res) => {
  const { id } = req.params;
  const brandData = req.body;
  const updatedBrand = await brandService.updateBrand(id, brandData);
  res.json(createResponse(updatedBrand));
};

export const deleteBrand = async (req, res) => {
  const { id } = req.params;
  const brand = await brandService.getBrandById(id);

  if (!brand) {
    return res.status(404).json({
      success: false,
      message: "Brand not found",
    });
  }

  await brandService.deleteBrand(id);
  res.json({
    success: true,
    message: "Brand deleted successfully",
  });
};

export const deleteBulkBrands = async (req, res) => {
  try {
    const { brandIds } = req.body;

    if (!Array.isArray(brandIds) || brandIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Danh sách ID nhãn hàng không hợp lệ",
      });
    }

    const result = await brandService.deleteBulkBrands(brandIds);

    // Nếu không có brands nào được xóa
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Không nhãn hàng nào được xóa. Kiểm tra lại ID nhãn hàng.",
      });
    }

    // Nếu một số brands không thể xóa
    if (result.deletedCount < result.requestedCount) {
      return res.json({
        success: true,
        message: `Đã xóa một phần. ${result.deletedCount} trong tổng số ${result.requestedCount} nhãn hàng đã được xóa.`,
      });
    }

    // Tất cả brands đã được xóa thành công
    res.json({
      success: true,
      message: `Đã xóa thành công ${result.deletedCount} nhãn hàng`,
    });
  } catch (error) {
    console.error("[deleteBulkBrands] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi xóa nhãn hàng",
    });
  }
};

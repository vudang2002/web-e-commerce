import * as brandService from "../services/brand.service.js";
import { formatResponse } from "../utils/response.util.js";

export const getBrands = async (req, res) => {
  try {
    const { categoryId } = req.query;

    // Nếu có categoryId trong query, trả về brands theo category
    if (categoryId) {
      const brands = await brandService.getBrandsByCategory(categoryId);
      return res.json(
        formatResponse(true, "Brands retrieved successfully", brands)
      );
    }

    // Nếu không có categoryId, trả về tất cả brands
    const brands = await brandService.getBrands();
    res.json(formatResponse(true, "Brands retrieved successfully", brands));
  } catch (error) {
    res
      .status(500)
      .json(formatResponse(false, `Error fetching brands: ${error.message}`));
  }
};

export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await brandService.getBrandById(id);
    if (!brand) {
      return res.status(404).json(formatResponse(false, "Brand not found"));
    }
    res.json(formatResponse(true, "Brand retrieved successfully", brand));
  } catch (error) {
    res.status(500).json(formatResponse(false, `Error: ${error.message}`));
  }
};

export const getBrandBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const brand = await brandService.getBrandBySlug(slug);

    if (!brand) {
      return res.status(404).json(formatResponse(false, "Brand not found"));
    }

    res.json(formatResponse(true, "Brand retrieved successfully", brand));
  } catch (error) {
    res.status(500).json(formatResponse(false, `Error: ${error.message}`));
  }
};

export const createBrand = async (req, res) => {
  try {
    const brandData = req.body;
    const newBrand = await brandService.createBrand(brandData);
    res
      .status(201)
      .json(formatResponse(true, "Brand created successfully", newBrand));
  } catch (error) {
    res
      .status(500)
      .json(formatResponse(false, `Error creating brand: ${error.message}`));
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brandData = req.body;
    const updatedBrand = await brandService.updateBrand(id, brandData);
    if (!updatedBrand) {
      return res.status(404).json(formatResponse(false, "Brand not found"));
    }
    res.json(formatResponse(true, "Brand updated successfully", updatedBrand));
  } catch (error) {
    res
      .status(500)
      .json(formatResponse(false, `Error updating brand: ${error.message}`));
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await brandService.getBrandById(id);

    if (!brand) {
      return res.status(404).json(formatResponse(false, "Brand not found"));
    }

    await brandService.deleteBrand(id);
    res.json(formatResponse(true, "Brand deleted successfully"));
  } catch (error) {
    res
      .status(500)
      .json(formatResponse(false, `Error deleting brand: ${error.message}`));
  }
};

export const deleteBulkBrands = async (req, res) => {
  try {
    const { brandIds } = req.body;

    if (!Array.isArray(brandIds) || brandIds.length === 0) {
      return res
        .status(400)
        .json(formatResponse(false, "Danh sách ID nhãn hàng không hợp lệ"));
    }

    const result = await brandService.deleteBulkBrands(brandIds);

    // Nếu không có brands nào được xóa
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json(
          formatResponse(
            false,
            "Không nhãn hàng nào được xóa. Kiểm tra lại ID nhãn hàng."
          )
        );
    }

    // Nếu một số brands không thể xóa
    if (result.deletedCount < result.requestedCount) {
      return res.json(
        formatResponse(
          true,
          `Đã xóa một phần. ${result.deletedCount} trong tổng số ${result.requestedCount} nhãn hàng đã được xóa.`
        )
      );
    }

    // Tất cả brands đã được xóa thành công
    res.json(
      formatResponse(true, `Đã xóa thành công ${result.deletedCount} nhãn hàng`)
    );
  } catch (error) {
    console.error("[deleteBulkBrands] Error:", error);
    res
      .status(500)
      .json(
        formatResponse(false, error.message || "Lỗi server khi xóa nhãn hàng")
      );
  }
};

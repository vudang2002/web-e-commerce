import * as brandService from "../services/brand.service.js";
import { createResponse } from "../utils/response.util.js";

export const getBrands = async (req, res) => {
  const brands = await brandService.getBrands();
  res.json(createResponse(brands));
};

export const getBrandById = async (req, res) => {
  const { id } = req.params;
  const brand = await brandService.getBrandById(id);
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

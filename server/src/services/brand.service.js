import Brand from "../models/brand.model.js";

export const getBrands = async () => {
  return await Brand.find();
};

export const getBrandById = async (id) => {
  return await Brand.findById(id);
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

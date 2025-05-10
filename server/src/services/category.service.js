import Category from "../models/category.model.js";

export const createCategory = async (data) => {
  try {
    const category = new Category(data);
    return await category.save();
  } catch (error) {
    throw new Error(`Error creating category: ${error.message}`);
  }
};

export const getCategories = async () => {
  try {
    return await Category.find();
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};

export const getCategoryById = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    throw new Error(`Error fetching category by ID: ${error.message}`);
  }
};

export const updateCategory = async (id, data) => {
  try {
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    throw new Error(`Error updating category: ${error.message}`);
  }
};

export const deleteCategory = async (id) => {
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    throw new Error(`Error deleting category: ${error.message}`);
  }
};

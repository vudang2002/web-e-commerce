import Category from "../models/category.model.js";
import { formatResponse, createResponse } from "../utils/response.util.js";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res
      .status(200)
      .json(
        formatResponse(true, "Categories retrieved successfully", categories)
      );
  } catch (error) {
    res
      .status(500)
      .json(
        formatResponse(false, `Error fetching categories: ${error.message}`)
      );
  }
};

// Get a category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json(formatResponse(false, "Category not found"));
    }
    res
      .status(200)
      .json(formatResponse(true, "Category retrieved successfully", category));
  } catch (error) {
    res.status(500).json(formatResponse(false, `Error: ${error.message}`));
  }
};

// Get category by slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json(formatResponse(false, "Category not found"));
    }
    res
      .status(200)
      .json(formatResponse(true, "Category retrieved successfully", category));
  } catch (error) {
    res.status(500).json(formatResponse(false, `Error: ${error.message}`));
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res
      .status(201)
      .json(formatResponse(true, "Category created successfully", category));
  } catch (error) {
    res
      .status(500)
      .json(formatResponse(false, `Error creating category: ${error.message}`));
  }
};

// Update a category by ID
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json(formatResponse(false, "Category not found"));
    }
    res
      .status(200)
      .json(formatResponse(true, "Category updated successfully", category));
  } catch (error) {
    res
      .status(500)
      .json(formatResponse(false, `Error updating category: ${error.message}`));
  }
};

// Delete a category by ID
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json(formatResponse(false, "Category not found"));
    }
    res.status(200).json(formatResponse(true, "Category deleted successfully"));
  } catch (error) {
    res
      .status(500)
      .json(formatResponse(false, `Error deleting category: ${error.message}`));
  }
};

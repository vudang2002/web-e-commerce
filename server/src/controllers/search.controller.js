import SearchService from "../services/search.service.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

class SearchController {
  // GET /api/search/suggestions?q=keyword
  static async getSearchSuggestions(req, res) {
    try {
      const { q: query, limit = 10 } = req.query;

      if (!query || query.trim().length < 2) {
        return successResponse(res, [], "Query too short");
      }

      const suggestions = await SearchService.getSearchSuggestions(
        query,
        parseInt(limit)
      );

      return successResponse(
        res,
        suggestions,
        "Search suggestions retrieved successfully"
      );
    } catch (error) {
      console.error("Error in getSearchSuggestions:", error);
      return errorResponse(res, "Failed to get search suggestions", 500);
    }
  }

  // GET /api/search/products
  static async searchProducts(req, res) {
    try {
      const filters = {
        query: req.query.q || "",
        category: req.query.category,
        brand: req.query.brand,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        sortBy: req.query.sortBy || "relevance",
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      };

      const result = await SearchService.searchProducts(filters);

      return successResponse(res, result, "Products searched successfully");
    } catch (error) {
      console.error("Error in searchProducts:", error);
      return errorResponse(res, "Failed to search products", 500);
    }
  }

  // GET /api/search/filters
  static async getFilterOptions(req, res) {
    try {
      const filterOptions = await SearchService.getFilterOptions();

      return successResponse(
        res,
        filterOptions,
        "Filter options retrieved successfully"
      );
    } catch (error) {
      console.error("Error in getFilterOptions:", error);
      return errorResponse(res, "Failed to get filter options", 500);
    }
  }

  // GET /api/search/popular
  static async getPopularSearchTerms(req, res) {
    try {
      const { limit = 10 } = req.query;
      const popularTerms = await SearchService.getPopularSearchTerms(
        parseInt(limit)
      );

      return successResponse(
        res,
        popularTerms,
        "Popular search terms retrieved successfully"
      );
    } catch (error) {
      console.error("Error in getPopularSearchTerms:", error);
      return errorResponse(res, "Failed to get popular search terms", 500);
    }
  }
}

export default SearchController;

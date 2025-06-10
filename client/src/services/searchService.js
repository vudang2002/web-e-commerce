import axiosClient from "../utils/axiosClient";

// Search suggestions/autocomplete
export const getSearchSuggestions = async (query, limit = 10, options = {}) => {
  try {
    const response = await axiosClient.get("/search/suggestions", {
      params: { q: query, limit },
      signal: options.signal, // Support for AbortController
    });
    return response; // axiosClient already returns response.data
  } catch (error) {
    console.error("Error getting search suggestions:", error);
    throw error;
  }
};

// Search products with filters
export const searchProducts = async (filters = {}) => {
  try {
    const response = await axiosClient.get("/search/products", {
      params: filters,
    });
    return response; // axiosClient already returns response.data
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Get filter options (brands, categories, price range)
export const getFilterOptions = async () => {
  try {
    const response = await axiosClient.get("/search/filters");
    return response; // axiosClient already returns response.data
  } catch (error) {
    console.error("Error getting filter options:", error);
    throw error;
  }
};

// Get popular search terms
export const getPopularSearchTerms = async (limit = 10) => {
  try {
    const response = await axiosClient.get("/search/popular", {
      params: { limit },
    });
    return response; // axiosClient already returns response.data
  } catch (error) {
    console.error("Error getting popular search terms:", error);
    throw error;
  }
};

const searchService = {
  getSearchSuggestions,
  searchProducts,
  getFilterOptions,
  getPopularSearchTerms,
};

export default searchService;

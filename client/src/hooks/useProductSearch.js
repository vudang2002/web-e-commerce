import { useState, useCallback } from "react";
import {
  getSearchSuggestions,
  searchProducts,
} from "../services/searchService";

/**
 * Custom hook for searching products (by name or id)
 * @returns {Object} { suggestions, isLoading, search, clear }
 */
export default function useProductSearch() {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search by product name (suggestion API)
  const search = useCallback(async (query) => {
    setIsLoading(true);
    try {
      let result = [];
      if (/^[0-9a-fA-F]{24}$/.test(query.trim())) {
        // If input is likely an order/product ID, search by id
        const response = await searchProducts({ query });
        if (response.success && response.data?.products) {
          result = response.data.products;
        }
      } else {
        // Otherwise, search by product name (suggestions)
        const response = await getSearchSuggestions(query);
        if (response.success && Array.isArray(response.data)) {
          result = response.data;
        }
      }
      setSuggestions(result);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => setSuggestions([]), []);

  return { suggestions, isLoading, search, clear };
}

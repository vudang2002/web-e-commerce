import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const useSearchFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL parameters
  const filtersFromURL = useMemo(
    () => ({
      query: searchParams.get("query") || searchParams.get("q") || "",
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sortBy: searchParams.get("sortBy") || "relevance",
      page: parseInt(searchParams.get("page")) || 1,
    }),
    [searchParams]
  );

  const [filters, setFilters] = useState(filtersFromURL);

  // Sync filters with URL when URL changes (browser navigation)
  useEffect(() => {
    setFilters(filtersFromURL);
  }, [filtersFromURL]);

  // Update URL when filters change programmatically
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params, { replace: true });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      [key]: value,
      ...(key !== "page" && { page: 1 }), // Reset page when other filters change
    };
    updateFilters(newFilters);
  };

  const handlePageChange = (page) => {
    updateFilters({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    const newFilters = {
      query: filters.query, // Keep the search query
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "relevance",
      page: 1,
    };
    setFilters(newFilters);

    const params = new URLSearchParams();
    if (newFilters.query) {
      params.set("query", newFilters.query);
    }
    params.set("sortBy", newFilters.sortBy);
    setSearchParams(params, { replace: true });
  };

  return {
    filters,
    handleFilterChange,
    handlePageChange,
    clearFilters,
  };
};

export default useSearchFilters;

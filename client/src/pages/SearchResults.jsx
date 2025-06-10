import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts, getFilterOptions } from "../services/searchService";
import ProductCard from "../components/home/ProductCard";
import { FiFilter, FiX, FiChevronDown } from "react-icons/fi";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    categories: [],
    priceRange: { minPrice: 0, maxPrice: 0 },
  });
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states - always sync with URL
  const [filters, setFilters] = useState(() => ({
    query: searchParams.get("query") || searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "relevance",
    page: parseInt(searchParams.get("page")) || 1,
  }));

  // Listen for URL parameter changes and update filters
  useEffect(() => {
    const newQuery = searchParams.get("query") || searchParams.get("q") || "";
    const newCategory = searchParams.get("category") || "";
    const newBrand = searchParams.get("brand") || "";
    const newMinPrice = searchParams.get("minPrice") || "";
    const newMaxPrice = searchParams.get("maxPrice") || "";
    const newSortBy = searchParams.get("sortBy") || "relevance";
    const newPage = parseInt(searchParams.get("page")) || 1;

    console.log("[SearchResults] URL changed, new query:", newQuery);

    // Only update if something actually changed
    setFilters((prevFilters) => {
      if (
        prevFilters.query !== newQuery ||
        prevFilters.category !== newCategory ||
        prevFilters.brand !== newBrand ||
        prevFilters.minPrice !== newMinPrice ||
        prevFilters.maxPrice !== newMaxPrice ||
        prevFilters.sortBy !== newSortBy ||
        prevFilters.page !== newPage
      ) {
        return {
          query: newQuery,
          category: newCategory,
          brand: newBrand,
          minPrice: newMinPrice,
          maxPrice: newMaxPrice,
          sortBy: newSortBy,
          page: newPage,
        };
      }
      return prevFilters;
    });
  }, [searchParams]);

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await getFilterOptions();
        if (response.success) {
          setFilterOptions(response.data);
        }
      } catch (error) {
        console.error("Error loading filter options:", error);
      }
    };

    loadFilterOptions();
  }, []);

  // Search products when filters change
  useEffect(() => {
    const performSearch = async () => {
      console.log("[SearchResults] Performing search with filters:", filters);
      setLoading(true);
      try {
        const response = await searchProducts({
          ...filters,
          limit: 20,
        });

        if (response.success) {
          setProducts(response.data.products);
          setPagination(response.data.pagination);
          console.log(
            "[SearchResults] Search completed, found:",
            response.data.pagination.totalCount,
            "products"
          );
        }
      } catch (error) {
        console.error("Error searching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [filters]);

  // Update URL when filters change manually (not from URL sync)
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      }
    });
    setSearchParams(params, { replace: true });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value,
      page: 1, // Reset page when filters change
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateURL(newFilters);
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
    updateURL(newFilters);
  };

  const sortOptions = [
    { value: "relevance", label: "Phù hợp nhất" },
    { value: "newest", label: "Mới nhất" },
    { value: "price_asc", label: "Giá thấp đến cao" },
    { value: "price_desc", label: "Giá cao đến thấp" },
    { value: "rating", label: "Đánh giá cao nhất" },
    { value: "sales", label: "Bán chạy nhất" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Kết quả tìm kiếm
          {filters.query && (
            <span className="text-primary"> cho "{filters.query}"</span>
          )}
        </h1>
        {pagination.totalCount !== undefined && (
          <p className="text-gray-600">
            Tìm thấy {pagination.totalCount} sản phẩm
          </p>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <div
          className={`w-80 flex-shrink-0 ${
            showFilters ? "block" : "hidden lg:block"
          }`}
        >
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Bộ lọc</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Xóa tất cả
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Danh mục</h4>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Tất cả danh mục</option>
                {filterOptions.categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Thương hiệu</h4>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Tất cả thương hiệu</option>
                {filterOptions.brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Khoảng giá</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Giá từ"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <input
                  type="number"
                  placeholder="Giá đến"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              {filterOptions.priceRange.maxPrice > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Từ {filterOptions.priceRange.minPrice.toLocaleString("vi-VN")}
                  ₫ -{" "}
                  {filterOptions.priceRange.maxPrice.toLocaleString("vi-VN")}₫
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <FiFilter size={16} />
              Bộ lọc
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Sắp xếp theo:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.category ||
            filters.brand ||
            filters.minPrice ||
            filters.maxPrice) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.category && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Danh mục:{" "}
                  {
                    filterOptions.categories.find(
                      (c) => c._id === filters.category
                    )?.name
                  }
                  <button onClick={() => handleFilterChange("category", "")}>
                    <FiX size={14} />
                  </button>
                </span>
              )}
              {filters.brand && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Thương hiệu:{" "}
                  {
                    filterOptions.brands.find((b) => b._id === filters.brand)
                      ?.name
                  }
                  <button onClick={() => handleFilterChange("brand", "")}>
                    <FiX size={14} />
                  </button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Giá:{" "}
                  {filters.minPrice &&
                    `${Number(filters.minPrice).toLocaleString("vi-VN")}₫`}
                  {filters.minPrice && filters.maxPrice && " - "}
                  {filters.maxPrice &&
                    `${Number(filters.maxPrice).toLocaleString("vi-VN")}₫`}
                  <button
                    onClick={() => {
                      handleFilterChange("minPrice", "");
                      handleFilterChange("maxPrice", "");
                    }}
                  >
                    <FiX size={14} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-gray-600 mb-4">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>

                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === pagination.currentPage;
                  const shouldShow =
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.currentPage) <= 2;

                  if (!shouldShow) {
                    if (
                      page === pagination.currentPage - 3 ||
                      page === pagination.currentPage + 3
                    ) {
                      return (
                        <span key={page} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border rounded-lg ${
                        isCurrentPage
                          ? "bg-primary text-white border-primary"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

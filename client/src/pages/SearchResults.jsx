import React, { useState, useEffect, useMemo } from "react";
import { searchProducts, getFilterOptions } from "../services/searchService";
import ProductCard from "../components/home/ProductCard";
import SearchHeader from "../components/search/SearchHeader";
import SearchFilters from "../components/search/SearchFilters";
import ActiveFilters from "../components/search/ActiveFilters";
import SearchSkeleton from "../components/search/SearchSkeleton";
import SmartPagination from "../components/search/SmartPagination";
import useSearchFilters from "../hooks/useSearchFilters";
import { FiFilter } from "react-icons/fi";

const SearchResults = () => {
  const { filters, handleFilterChange, handlePageChange, clearFilters } = useSearchFilters();
  
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    categories: [],
    priceRange: { minPrice: 0, maxPrice: 0 },
  });
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Sort options
  const sortOptions = useMemo(() => [
    { value: "relevance", label: "Phù hợp nhất" },
    { value: "newest", label: "Mới nhất" },
    { value: "price_asc", label: "Giá thấp đến cao" },
    { value: "price_desc", label: "Giá cao đến thấp" },
    { value: "rating", label: "Đánh giá cao nhất" },
    { value: "sales", label: "Bán chạy nhất" },
  ], []);

  // Load filter options on component mount
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
      setLoading(true);
      try {
        const response = await searchProducts({
          ...filters,
          limit: 20,
        });

        if (response.success) {
          setProducts(response.data.products);
          setPagination(response.data.pagination);
        } else {
          setProducts([]);
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

  const EmptyResults = () => (
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
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <SearchHeader 
        query={filters.query} 
        totalCount={pagination.totalCount} 
      />

      <div className="flex gap-6">
        <SearchFilters
          filters={filters}
          filterOptions={filterOptions}
          showFilters={showFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

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

          <ActiveFilters
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          />

          {/* Loading State */}
          {loading && <SearchSkeleton count={12} />}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && products.length === 0 && <EmptyResults />}

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <SmartPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

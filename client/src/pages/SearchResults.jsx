import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { searchProducts, getFilterOptions } from "../services/searchService";
import ProductCard from "../components/home/ProductCard";
import SearchHeader from "../components/search/SearchHeader";
import SearchFilters from "../components/search/SearchFilters";
import ActiveFilters from "../components/search/ActiveFilters";
import useSearchFilters from "../hooks/useSearchFilters";
import { FiFilter } from "react-icons/fi";

const SearchResults = () => {
  const { t } = useTranslation();
  const { filters, handleFilterChange, handlePageChange, clearFilters } =
    useSearchFilters();

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
  const sortOptions = useMemo(
    () => [
      { value: "relevance", label: t('search.sort_options.relevance') },
      { value: "newest", label: t('search.sort_options.newest') },
      { value: "price_asc", label: t('search.sort_options.price_asc') },
      { value: "price_desc", label: t('search.sort_options.price_desc') },
      { value: "rating", label: t('search.sort_options.rating') },
      { value: "sales", label: t('search.sort_options.sales') },
    ],
    [t]
  );

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Results Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchHeader
          query={filters.query}
          totalCount={pagination.totalCount}
        />

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0">
            <SearchFilters
              filters={filters}
              filterOptions={filterOptions}
              showFilters={showFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Top Bar with Sort Options */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiFilter size={16} />
                  {t('search.filters')}
                </button>

                <div className="flex items-center gap-4 ml-auto">
                  <span className="text-sm font-medium text-gray-700">
                    {t('search.sort_by')}
                  </span>
                  <div className="flex gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleFilterChange("sortBy", option.value)
                        }
                        className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                          filters.sortBy === option.value
                            ? "bg-red-500 text-white border-red-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Show result count */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  {pagination.totalCount > 0 && (
                    <>
                      {t('search.showing_results')} {(pagination.currentPage - 1) * 20 + 1}-
                      {Math.min(
                        pagination.currentPage * 20,
                        pagination.totalCount
                      )}{" "}
                      {t('search.of_total')} {pagination.totalCount} {t('search.products')}
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
            />

            {/* Products Grid */}
            <div className="mt-6">
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-6 text-gray-600 text-lg">
                    {t('search.searching')}
                  </p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="text-8xl text-gray-300 mb-6">🔍</div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-3">
                    {t('search.no_products_found')}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {t('search.no_products_message')}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    {t('search.clear_filters')}
                  </button>
                </div>
              ) : (
                <>
                  {/* Products Grid - 5 columns like CategoryPage */}
                  <div className="grid grid-cols-5 gap-6 bg-white p-6 rounded-lg shadow-sm">
                    {products.map((product) => (
                      <div key={product._id} className="w-full">
                        <ProductCard
                          product={product}
                          className="w-full h-full border border-gray-100 hover:border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={!pagination.hasPrev}
                          className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                        >
                          ← {t('search.previous')}
                        </button>

                        {[...Array(Math.min(pagination.totalPages, 10))].map(
                          (_, index) => {
                            const page = index + 1;
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  page === pagination.currentPage
                                    ? "bg-red-600 text-white shadow-md"
                                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          }
                        )}

                        <button
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={!pagination.hasNext}
                          className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                        >
                          {t('search.next')} →
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

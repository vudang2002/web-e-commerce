import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { searchProducts } from "../services/searchService";
import { getCategoryBySlug } from "../services/categoryService";
import ProductCard from "../components/home/ProductCard";
import { FiGrid, FiList, FiFilter, FiChevronDown } from "react-icons/fi";

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Filter states
  const [filters, setFilters] = useState({
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });

  // Load category info
  useEffect(() => {
    const loadCategory = async () => {
      if (!slug) return;

      setCategoryLoading(true);
      try {
        const response = await getCategoryBySlug(slug);
        if (response?.success && response?.data) {
          setCategory(response.data);
        } else {
          console.error("Category not found");
          setCategory(null);
        }
      } catch (error) {
        console.error("Error loading category:", error);
        setCategory(null);
      } finally {
        setCategoryLoading(false);
      }
    };

    loadCategory();
  }, [slug]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      if (!category?._id) return;

      setLoading(true);
      try {
        // Use searchProducts API for better filtering support
        const searchFilters = {
          category: category._id,
          page: filters.page,
          limit: 20,
        };

        // Map sorting to backend expected format
        if (filters.sortBy === "price") {
          searchFilters.sortBy =
            filters.sortOrder === "asc" ? "price_asc" : "price_desc";
        } else if (filters.sortBy === "createdAt") {
          searchFilters.sortBy =
            filters.sortOrder === "asc" ? "createdAt" : "newest";
        } else if (filters.sortBy === "name") {
          searchFilters.sortBy =
            filters.sortOrder === "asc" ? "name_asc" : "name_desc";
        } else if (filters.sortBy === "sold") {
          searchFilters.sortBy = "sales";
        } else if (filters.sortBy === "rating") {
          searchFilters.sortBy = "rating";
        } else {
          searchFilters.sortBy = "newest"; // default
        }

        // Add price filters if they exist
        if (filters.minPrice) searchFilters.minPrice = filters.minPrice;
        if (filters.maxPrice) searchFilters.maxPrice = filters.maxPrice;

        console.log("Loading products with filters:", searchFilters);

        const response = await searchProducts(searchFilters);

        console.log("Products response:", response);

        if (response?.success && response?.data) {
          setProducts(response.data.products || []);
          setPagination(response.data.pagination || {});
        } else {
          setProducts([]);
          setPagination({});
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
        setPagination({});
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category?._id, filters]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.sortBy !== "createdAt") params.set("sortBy", filters.sortBy);
    if (filters.sortOrder !== "desc")
      params.set("sortOrder", filters.sortOrder);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.page > 1) params.set("page", filters.page.toString());

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset page when other filters change
    }));
  };

  const handlePageChange = (newPage) => {
    handleFilterChange("page", newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (sortValue) => {
    const [sortBy, sortOrder] = sortValue.split("-");
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder,
      page: 1, // Reset page when sorting changes
    }));
  };

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh mục...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy danh mục
          </h1>
          <p className="text-gray-600">Danh mục bạn tìm kiếm không tồn tại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600 mt-2">{category.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and View Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Results count and view mode */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {pagination.totalCount !== undefined
                  ? `${pagination.totalCount} sản phẩm`
                  : "Đang tải..."}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>

            {/* Sort and Filter */}
            <div className="flex items-center space-x-4">
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="createdAt-desc">Mới nhất</option>
                <option value="createdAt-asc">Cũ nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
                <option value="sold-desc">Bán chạy nhất</option>
                <option value="rating-desc">Đánh giá cao nhất</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
              >
                <FiFilter size={18} />
                <span>Bộ lọc</span>
                <FiChevronDown
                  className={`transform transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá từ (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá đến (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    placeholder="Không giới hạn"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Quick price filters */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng giá phổ biến
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      handleFilterChange("minPrice", "");
                      handleFilterChange("maxPrice", "1000000");
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Dưới 1 triệu
                  </button>
                  <button
                    onClick={() => {
                      handleFilterChange("minPrice", "1000000");
                      handleFilterChange("maxPrice", "5000000");
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    1 - 5 triệu
                  </button>
                  <button
                    onClick={() => {
                      handleFilterChange("minPrice", "5000000");
                      handleFilterChange("maxPrice", "10000000");
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    5 - 10 triệu
                  </button>
                  <button
                    onClick={() => {
                      handleFilterChange("minPrice", "10000000");
                      handleFilterChange("maxPrice", "");
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Trên 10 triệu
                  </button>
                  {(filters.minPrice || filters.maxPrice) && (
                    <button
                      onClick={() => {
                        handleFilterChange("minPrice", "");
                        handleFilterChange("maxPrice", "");
                      }}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                    >
                      Xóa bộ lọc giá
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Không tìm thấy sản phẩm nào
            </h3>
            <p className="text-gray-600 mb-4">
              {filters.minPrice || filters.maxPrice
                ? "Không có sản phẩm nào trong khoảng giá này."
                : "Danh mục này hiện tại chưa có sản phẩm nào."}
            </p>
            {(filters.minPrice || filters.maxPrice) && (
              <button
                onClick={() => {
                  handleFilterChange("minPrice", "");
                  handleFilterChange("maxPrice", "");
                }}
                className="text-red-600 hover:text-red-800 underline"
              >
                Xóa bộ lọc giá
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  className={viewMode === "list" ? "flex-row" : ""}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Trước
                  </button>

                  {[...Array(Math.min(pagination.totalPages, 10))].map(
                    (_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg ${
                            page === filters.page
                              ? "bg-red-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

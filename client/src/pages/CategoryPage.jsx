import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useCategory, useProductsByCategory } from "../hooks/useProductData";
import ProductCard from "../components/home/ProductCard";
import CategorySidebar from "../components/category/CategorySidebar";
import CategoryFilters from "../components/category/CategoryFilters";

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [filters, setFilters] = useState({
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });

  // Use hooks to fetch data
  const { data: category, isLoading: categoryLoading } = useCategory(slug);
  const { data: productsData, isLoading: productsLoading } =
    useProductsByCategory(category?._id, filters);

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {};

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
      {/* Category Header Banner */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <img
          src="/images/banner/banner-featured-product.jpg"
          alt="Flash Sale Banner"
          className="w-full h-full object-cover mb-6"
        />
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0">
            <CategorySidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Filters */}
            <CategoryFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              totalProducts={pagination.totalCount || 0}
            />

            {/* Products Grid */}
            <div className="mt-6">
              {productsLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-6 text-gray-600 text-lg">
                    Đang tải sản phẩm...
                  </p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="text-8xl text-gray-300 mb-6">📦</div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-3">
                    Không tìm thấy sản phẩm nào
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {filters.minPrice || filters.maxPrice
                      ? "Không có sản phẩm nào trong khoảng giá này. Hãy thử điều chỉnh bộ lọc."
                      : "Danh mục này hiện tại chưa có sản phẩm nào. Vui lòng quay lại sau."}
                  </p>
                  {(filters.minPrice || filters.maxPrice) && (
                    <button
                      onClick={() => {
                        handleFilterChange("minPrice", "");
                        handleFilterChange("maxPrice", "");
                      }}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Xóa bộ lọc giá
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Products Grid - 5 columns */}
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
                          onClick={() => handlePageChange(filters.page - 1)}
                          disabled={!pagination.hasPrev}
                          className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                        >
                          ← Trước
                        </button>

                        {[...Array(Math.min(pagination.totalPages, 10))].map(
                          (_, index) => {
                            const page = index + 1;
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  page === filters.page
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
                          onClick={() => handlePageChange(filters.page + 1)}
                          disabled={!pagination.hasNext}
                          className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                        >
                          Sau →
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

export default CategoryPage;

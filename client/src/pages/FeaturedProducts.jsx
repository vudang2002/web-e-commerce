import React, { useState } from "react";
import { useFeaturedProducts } from "../hooks/useProductData";
import FlashSaleProductCard from "../components/home/FlashSaleProductCardInPage";

const FeaturedProducts = () => {
  const {
    data: featuredProducts = [],
    isLoading,
    error,
  } = useFeaturedProducts();

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Tính toán sản phẩm hiển thị theo trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = featuredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(featuredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Có lỗi xảy ra khi tải sản phẩm
            </h2>
            <p className="text-gray-600">Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-[1200px] mx-auto px-4 bg-gray-50">
      {/* Sticky Header */}

      <div className="w-full h-full max-w-[1200px] mx-auto overflow-hidden ">
        {/* Banner Image */}
        <img
          src="/images/banner/banner-featured-product.jpg"
          alt="Flash Sale Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-[1200px]">
        {/* Lưới sản phẩm */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
            {currentProducts.map((product, index) => (
              <FlashSaleProductCard
                key={product._id || index}
                image={
                  Array.isArray(product.images)
                    ? product.images[0]
                    : product.images || "/images/products/manhinh.png"
                }
                price={product.price}
                badge="NỔI BẬT"
                name={product.name}
                id={product._id}
                discount={product.discount ? `-${product.discount}%` : null}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Không có sản phẩm nổi bật nào
            </h3>
            <p className="text-gray-500">
              Hãy quay lại sau để xem những sản phẩm mới nhất.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            {/* Nút Previous */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              Trước
            </button>

            {/* Số trang */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              const isCurrentPage = pageNumber === currentPage;

              // Hiển thị trang đầu, cuối và các trang xung quanh trang hiện tại
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      isCurrentPage
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 3 ||
                pageNumber === currentPage + 3
              ) {
                return (
                  <span key={pageNumber} className="px-2 py-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}

            {/* Nút Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;

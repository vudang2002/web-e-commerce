import React from "react";
import { useQuery } from "react-query";
import { getHotDealsProducts } from "../services/productService";
import ProductCard from "../components/home/ProductCard";
import Breadcrumb from "../components/common/Breadcrumb";

const HotDealsPage = () => {
  // Lấy các sản phẩm giảm giá > 40%
  const { data, isLoading, error } = useQuery({
    queryKey: ["hot-deals-products"],
    queryFn: () => getHotDealsProducts(40),
  });
  return (
    <div>
      <div className="max-w-[1200px] mx-auto px-4  ">
        <div className="w-full h-full max-w-[1200px] mx-auto overflow-hidden  ">
          {/* Banner Image */}
          <img
            src="/images/banner/banner-featured-product.jpg"
            alt="Flash Sale Banner"
            className="w-full h-full object-cover"
          />
        </div>
        {isLoading && (
          <div className="text-center text-gray-500">Đang tải sản phẩm...</div>
        )}
        {error && (
          <div className="text-center text-red-500">
            Lỗi tải sản phẩm: {error.message}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 py-6 ">
          {data?.products?.length > 0
            ? data.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            : !isLoading && (
                <div className="col-span-full text-center text-gray-500">
                  Không có sản phẩm nào!
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default HotDealsPage;

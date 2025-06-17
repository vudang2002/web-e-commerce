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
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Hàng giá hời", path: "/hot-deals" }]} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-red-600">
          Hàng Giá Hời - Giảm Giá Sốc
        </h1>
        {isLoading && (
          <div className="text-center text-gray-500">Đang tải sản phẩm...</div>
        )}
        {error && (
          <div className="text-center text-red-500">
            Lỗi tải sản phẩm: {error.message}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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

import React from "react";
import { FiTrendingUp } from "react-icons/fi";

const TopProductsCard = ({ products, formatCurrency, formatNumber }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FiTrendingUp className="h-5 w-5 text-green-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">
          Top 5 sản phẩm bán chạy nhất
        </h2>
      </div>
      <div className="space-y-3">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={product._id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : index === 1
                        ? "bg-gray-100 text-gray-800"
                        : index === 2
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Đã bán: {formatNumber(product.sold || 0)} sản phẩm
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-xs text-green-600">
                  {product.category?.name || "Chưa phân loại"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Chưa có sản phẩm bán chạy
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProductsCard;

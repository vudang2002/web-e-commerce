import React from "react";
import { FiFilter, FiGrid, FiList } from "react-icons/fi";

const CategoryFilters = ({ filters, onFilterChange, totalProducts = 0 }) => {
  const handleSortChange = (sortValue) => {
    const [sortBy, sortOrder] = sortValue.split("-");
    onFilterChange("sortBy", sortBy);
    onFilterChange("sortOrder", sortOrder);
  };

  const sortOptions = [
    { value: "createdAt-desc", label: "Mới nhất" },
    { value: "sold-desc", label: "Bán chạy" },
    { value: "price-asc", label: "Giá thấp" },
    { value: "price-desc", label: "Giá cao" },
    { value: "rating-desc", label: "Đánh giá" },
    { value: "rating-desc", label: "Đánh giá" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <FiFilter className="text-gray-500" size={18} />
            <span className="text-gray-700 font-medium">Sắp xếp theo:</span>
          </div>

          <div className="flex space-x-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  `${filters.sortBy}-${filters.sortOrder}` === option.value
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-600">
            <span className="text-red-600 font-semibold">{totalProducts}</span>{" "}
            sản phẩm
          </div>
        </div>
      </div>

      {/* Price Filter Section */}
      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng giá (VNĐ)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                placeholder="Từ"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
              <span className="text-gray-400 font-medium">—</span>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                placeholder="Đến"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <button
              onClick={() => {
                onFilterChange("minPrice", "");
                onFilterChange("maxPrice", "");
              }}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
            >
              Áp dụng
            </button>
          </div>

          <div className="md:col-span-1">
            <button
              onClick={() => {
                onFilterChange("minPrice", "");
                onFilterChange("maxPrice", "");
              }}
              className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Quick price filters */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lọc nhanh:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                onFilterChange("minPrice", "");
                onFilterChange("maxPrice", "1000000");
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            >
              Dưới 1 triệu
            </button>
            <button
              onClick={() => {
                onFilterChange("minPrice", "1000000");
                onFilterChange("maxPrice", "5000000");
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            >
              1 - 5 triệu
            </button>
            <button
              onClick={() => {
                onFilterChange("minPrice", "5000000");
                onFilterChange("maxPrice", "10000000");
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            >
              5 - 10 triệu
            </button>
            <button
              onClick={() => {
                onFilterChange("minPrice", "10000000");
                onFilterChange("maxPrice", "");
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            >
              Trên 10 triệu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;

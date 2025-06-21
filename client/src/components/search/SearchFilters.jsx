import React from "react";

const SearchFilters = ({
  filters,
  filterOptions,
  showFilters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div
      className={`w-80 flex-shrink-0 ${
        showFilters ? "block" : "hidden lg:block"
      }`}
    >
      <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Bộ lọc</h3>
          <button
            onClick={onClearFilters}
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
            onChange={(e) => onFilterChange("category", e.target.value)}
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
            onChange={(e) => onFilterChange("brand", e.target.value)}
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
              onChange={(e) => onFilterChange("minPrice", e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <input
              type="number"
              placeholder="Giá đến"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange("maxPrice", e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          {filterOptions.priceRange.maxPrice > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Từ {filterOptions.priceRange.minPrice.toLocaleString("vi-VN")}₫ -{" "}
              {filterOptions.priceRange.maxPrice.toLocaleString("vi-VN")}₫
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;

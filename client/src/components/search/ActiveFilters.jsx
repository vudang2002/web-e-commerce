import React, { useMemo } from "react";
import { FiX } from "react-icons/fi";

const ActiveFilters = ({ filters, filterOptions, onFilterChange }) => {
  const activeFilters = useMemo(() => {
    const active = [];

    if (filters.category) {
      const categoryName = filterOptions.categories.find(
        (c) => c._id === filters.category
      )?.name;
      active.push({
        key: "category",
        label: `Danh mục: ${categoryName}`,
        onRemove: () => onFilterChange("category", ""),
      });
    }

    if (filters.brand) {
      const brandName = filterOptions.brands.find(
        (b) => b._id === filters.brand
      )?.name;
      active.push({
        key: "brand",
        label: `Thương hiệu: ${brandName}`,
        onRemove: () => onFilterChange("brand", ""),
      });
    }

    if (filters.minPrice || filters.maxPrice) {
      let priceLabel = "Giá: ";
      if (filters.minPrice) {
        priceLabel += `${Number(filters.minPrice).toLocaleString("vi-VN")}₫`;
      }
      if (filters.minPrice && filters.maxPrice) {
        priceLabel += " - ";
      }
      if (filters.maxPrice) {
        priceLabel += `${Number(filters.maxPrice).toLocaleString("vi-VN")}₫`;
      }

      active.push({
        key: "price",
        label: priceLabel,
        onRemove: () => {
          onFilterChange("minPrice", "");
          onFilterChange("maxPrice", "");
        },
      });
    }

    return active;
  }, [filters, filterOptions, onFilterChange]);

  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {activeFilters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
        >
          {filter.label}
          <button
            onClick={filter.onRemove}
            className="hover:bg-primary/20 rounded-full p-0.5"
          >
            <FiX size={14} />
          </button>
        </span>
      ))}
    </div>
  );
};

export default ActiveFilters;

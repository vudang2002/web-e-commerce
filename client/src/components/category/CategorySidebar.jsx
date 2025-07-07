import React from "react";
import { Link, useParams } from "react-router-dom";
import { useCategories } from "../../hooks/useProductData";
import { FiChevronRight } from "react-icons/fi";
import { CiCircleList } from "react-icons/ci";
const CategorySidebar = () => {
  const { slug } = useParams();
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-10 bg-gray-200 rounded mb-2 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
      <div className="px-4 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <h3 className="font-bold text-lg flex items-center">
          <CiCircleList className="mr-2" size={24} />
          Danh mục sản phẩm
        </h3>
      </div>

      <div className="p-0">
        {categories.map((category, index) => (
          <Link
            key={category._id}
            to={`/category/${category.slug}`}
            className={`block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 group ${
              category.slug === slug
                ? "bg-red-50 text-red-600 border-r-4 border-r-red-500 font-semibold"
                : "text-gray-700 hover:text-red-600"
            } ${index === categories.length - 1 ? "border-b-0" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-8 h-8 rounded-lg mr-3 object-cover border border-gray-200"
                  />
                )}
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <FiChevronRight
                className={`transition-transform duration-200 ${
                  category.slug === slug
                    ? "transform rotate-90 text-red-500"
                    : "text-gray-400 group-hover:text-red-500"
                }`}
                size={16}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;

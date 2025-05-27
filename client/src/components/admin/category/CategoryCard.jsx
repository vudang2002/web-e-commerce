import React from "react";

const CategoryCard = ({ category }) => {
  // destructure category fields
  const { name, image = "", description, slug = "" } = category || {};

  return (
    <div className="bg-[#ffffff] rounded-xl p-4 shadow-sm w-full max-w-xs mx-auto">
      {/* Top: Image + details */}
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border">
          <img
            src={image || "/images/category/default.png"}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-base leading-tight">
                {name}
              </div>
              <div className="text-xs text-gray-500">
                Slug: {slug.substring(0, 15)}
                {slug.length > 15 ? "..." : ""}
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-700">
              <span className="text-xl">&#8942;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-3 text-sm">
        <div className="font-medium text-gray-700">Mô tả</div>
        <div className="text-gray-500 text-xs line-clamp-2">
          {description || "Không có mô tả"}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg mt-4 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Đường dẫn:</span>
          <span className="text-blue-600 font-medium overflow-hidden text-ellipsis">
            /{slug}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;

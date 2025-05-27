import React from "react";

const ProductCard = ({ product }) => {
  // destructure product fields
  const {
    name,
    images = [],
    category,
    price,
    description,
    stock = 0,
    sold = 0, // sử dụng sold từ database thay vì sales
  } = product || {};

  return (
    <div className="bg-[#ffffff] rounded-xl p-4 shadow-sm w-full max-w-xs mx-auto border border-primary hover:shadow-md transition-shadow duration-200">
      {/* Top: Image + menu */}
      <div className="flex items-start gap-3">
        <img
          src={images[0] || "/images/products/default.png"}
          alt={name}
          className="w-16 h-16 object-cover rounded-md border"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-base leading-tight">
                {name}
              </div>
              <div className="text-xs text-gray-500">
                {category?.name || "Category"}
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-700">
              <span className="text-xl">&#8942;</span>
            </button>
          </div>
          <div className="font-semibold text-sm mt-1">
            price:{" "}
            <span className="font-normal">
              {price ? price.toLocaleString() : "-"}
            </span>
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="mt-2 text-sm">
        <div className="font-medium text-gray-700">Mô tả</div>
        <div className="text-gray-500 text-xs line-clamp-2">
          {description || "description"}
        </div>
      </div>
      {/* Stats */}
      <div className="bg-white rounded-lg mt-4 p-3">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-500">Đã Bán</span>
          <span className="text-orange-500 font-semibold flex items-center gap-1">
            <span className="text-xs">&#8593;</span> {sold}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Tồn Kho</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-orange-400 rounded-full"
                style={{ width: `${Math.min(stock, 100)}%` }}
              ></div>
            </div>
            <span className="text-gray-700 font-medium">{stock}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

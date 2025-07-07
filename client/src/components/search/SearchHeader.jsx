import React from "react";

const SearchHeader = ({ query, totalCount }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Kết quả tìm kiếm cho
        {query && <span className="text-primary"> "{query}"</span>}
      </h1>
      {totalCount !== undefined && (
        <p className="text-gray-600">
          Tìm thấy {totalCount.toLocaleString("vi-VN")} sản phẩm
        </p>
      )}
    </div>
  );
};

export default SearchHeader;

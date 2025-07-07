import React from "react";
import { useTranslation } from "react-i18next";

const SearchHeader = ({ query, totalCount }) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {t("search_header.title")}
        {query && <span className="text-primary"> "{query}"</span>}
      </h1>
      {totalCount !== undefined && (
        <p className="text-gray-600">
          {t("search_header.total_count")} {totalCount.toLocaleString("vi-VN")}{" "}
          sản phẩm
        </p>
      )}
    </div>
  );
};

export default SearchHeader;

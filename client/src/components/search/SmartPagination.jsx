import React, { useMemo } from "react";

const SmartPagination = ({ pagination, onPageChange }) => {
  const pageNumbers = useMemo(() => {
    const { currentPage, totalPages } = pagination;
    const pages = [];
    const delta = 2; // Show 2 pages before and after current page

    // Always show first page
    if (totalPages > 0) {
      pages.push(1);
    }

    // Add ellipsis after first page if needed
    if (currentPage > delta + 2) {
      pages.push("...");
    }

    // Add pages around current page
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Add ellipsis before last page if needed
    if (currentPage < totalPages - delta - 1) {
      if (!pages.includes("...")) {
        pages.push("...");
      }
    }

    // Always show last page if there's more than one page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  }, [pagination]);

  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrev}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Trước
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          const isCurrentPage = page === pagination.currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] px-3 py-2 border rounded-lg transition-colors ${
                isCurrentPage
                  ? "bg-primary text-white border-primary"
                  : "hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next button */}
        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNext}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sau
        </button>
      </div>

      {/* Quick jump to first/last */}
      {pagination.totalPages > 10 && (
        <div className="ml-4 flex items-center gap-2">
          {pagination.currentPage > 5 && (
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            >
              Đầu
            </button>
          )}
          {pagination.currentPage < pagination.totalPages - 4 && (
            <button
              onClick={() => onPageChange(pagination.totalPages)}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            >
              Cuối
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartPagination;

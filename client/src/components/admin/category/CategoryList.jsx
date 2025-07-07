import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { deleteCategory } from "../../../services/categoryService";
import { useCategories } from "../../../hooks/useProductData";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FiChevronLeft, FiChevronRight, FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../../common/ConfirmModal";

const CategoryList = () => {
  // Sử dụng hook useCategories để fetch dữ liệu
  const {
    data: categoriesData,
    isLoading,
    error: queryError,
    refetch,
  } = useCategories();

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 0,
  });

  // Cập nhật categories khi data từ hook thay đổi
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
      setPagination((prev) => ({
        ...prev,
        total: categoriesData.length,
        totalPages: Math.ceil(categoriesData.length / prev.limit),
      }));
      setError(null);
    }
    if (queryError) {
      setError(queryError.message || "Error fetching categories");
    }
  }, [categoriesData, queryError]);
  // Tính toán dữ liệu cho trang hiện tại
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const currentPageCategories = categories.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Không cần useEffect để fetch ban đầu vì hook đã tự động fetch

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await deleteCategory(categoryToDelete._id);
      if (response?.success) {
        toast.success("Xóa danh mục thành công!");
        refetch(); // Refresh dữ liệu sau khi xóa
      } else {
        toast.error(
          "Xóa danh mục thất bại: " +
            (response?.message || "Lỗi không xác định")
        );
      }
    } catch (err) {
      toast.error("Lỗi khi xóa: " + (err.message || "Lỗi không xác định"));
    } finally {
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return <div className="text-red-500 p-10 text-center">{error}</div>;
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Quản Lý Danh Mục
          </h1>
          <p className="text-gray-500 mt-1">
            Tổng số danh mục: {pagination.total} danh mục
          </p>
        </div>
        <div>
          <Link
            to="/admin/categories/create"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <IoMdAddCircleOutline className="mr-2" />
            Thêm Danh Mục
          </Link>
        </div>
      </div>

      <div>
        {currentPageCategories.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Logo
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Tên Danh Mục
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Mô tả
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Slug
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPageCategories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-10 w-10 object-contain"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded">
                            <span className="text-gray-500 text-xs">
                              No image
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 font-medium">
                        <Link
                          to={`/admin/categories/detail/${category._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {category.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {category.description
                          ? category.description.length > 50
                            ? `${category.description.substring(0, 50)}...`
                            : category.description
                          : ""}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {category._id
                          ? category._id.length > 50
                            ? `${category._id.substring(0, 50)}...`
                            : category._id
                          : ""}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {category.slug}
                      </td>
                      <td className="px-4 py-4 text-right space-x-2">
                        <Link
                          to={`/admin/categories/update/${category._id}`}
                          className="text-blue-600 hover:text-blue-800 inline-block"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="text-red-600 hover:text-red-800 inline-block"
                        >
                          <RiDeleteBin6Line size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`p-2 mx-1 rounded-md ${
                      pagination.page === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-100"
                    }`}
                    aria-label="Previous Page"
                  >
                    <FiChevronLeft size={18} />
                  </button>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= pagination.page - 1 &&
                          page <= pagination.page + 1)
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="p-2 mx-1">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 mx-1 rounded-md ${
                            pagination.page === page
                              ? "bg-blue-600 text-white"
                              : "hover:bg-blue-100"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`p-2 mx-1 rounded-md ${
                      pagination.page === pagination.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-100"
                    }`}
                    aria-label="Next Page"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Chưa có danh mục nào</p>
            <Link
              to="/admin/categories/create"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition inline-block"
            >
              Thêm danh mục đầu tiên
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && categoryToDelete && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete.name}" không?`}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default CategoryList;

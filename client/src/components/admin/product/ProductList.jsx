import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import {
  getProducts,
  deleteBulkProducts,
  deleteProduct,
} from "../../../services/productService";
import { IoMdAddCircleOutline, IoMdTrash } from "react-icons/io";
import { FiChevronLeft, FiChevronRight, FiEdit } from "react-icons/fi";
import { BsCheckSquare, BsSquare } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import ProductPrice from "../../common/ProductPrice";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../../common/ConfirmModal";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchProducts = useCallback(
    (page = 1) => {
      // Không cho phép gọi page < 1
      if (page < 1) page = 1;
      // Nếu đã biết tổng số trang, không cho phép vượt quá
      if (pagination.totalPages && page > pagination.totalPages)
        page = pagination.totalPages;
      setLoading(true);
      // Truyền tham số page và limit vào API
      getProducts(`?page=${page}&limit=12`)
        .then((response) => {
          // Check if the response has the expected structure based on server response format
          if (response?.success && Array.isArray(response?.data?.products)) {
            setProducts(response.data.products);
            // Cập nhật thông tin phân trang
            setPagination({
              page: response.data.page || 1,
              limit: response.data.limit || 12,
              total: response.data.total || 0,
              totalPages: Math.ceil(
                (response.data.total || 0) / (response.data.limit || 12)
              ),
            });
          } else {
            // If the structure is unexpected, log it for debugging
            console.error("Unexpected API response structure:", response);
            setProducts([]);
            setError("Invalid data format received from server");
          }
        })
        .catch((err) => {
          console.error("API Error:", err);
          setError(err.message || "Error fetching products");
        })
        .finally(() => setLoading(false));
    },
    [pagination.totalPages]
  );

  // Toggle selection of a product
  const toggleProductSelection = (productId) => {
    if (isDeleteMode) {
      setSelectedProducts((prev) => ({
        ...prev,
        [productId]: !prev[productId],
      }));
    }
  };

  // Toggle select all products
  const toggleSelectAll = () => {
    if (Object.values(selectedProducts).every((val) => val)) {
      // If all are selected, deselect all
      setSelectedProducts({});
    } else {
      // Otherwise, select all
      const allSelected = {};
      products.forEach((product) => {
        allSelected[product._id] = true;
      });
      setSelectedProducts(allSelected);
    }
  };

  // Mở modal xác nhận xóa
  const openConfirmDeleteModal = () => {
    const productIds = Object.entries(selectedProducts)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);

    if (productIds.length === 0) {
      toast.warning("Không có sản phẩm nào được chọn");
      return;
    }

    setIsBulkDelete(true);
    setShowConfirmModal(true);
  };

  // Hủy xóa sản phẩm
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  // Xử lý click xóa sản phẩm đơn lẻ
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsBulkDelete(false);
    setShowConfirmModal(true);
  };

  // Xử lý xác nhận xóa sản phẩm đơn lẻ
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      const response = await deleteProduct(productToDelete._id);
      if (response?.success) {
        toast.success("Xóa sản phẩm thành công!");
        fetchProducts(pagination.page);
      } else {
        toast.error(
          "Xóa sản phẩm thất bại: " +
            (response?.message || "Lỗi không xác định")
        );
      }
    } catch (err) {
      toast.error("Lỗi khi xóa: " + (err.message || "Lỗi không xác định"));
    } finally {
      setShowConfirmModal(false);
      setProductToDelete(null);
    }
  };

  // Xử lý xóa hàng loạt
  const handleBulkDelete = async () => {
    const productIds = Object.entries(selectedProducts)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);

    console.log("Selected product IDs for deletion:", productIds);

    if (productIds.length === 0) {
      toast.warning("Không có sản phẩm nào được chọn");
      return;
    }

    setDeleteLoading(true);
    setShowConfirmModal(false); // Đóng modal xác nhận

    try {
      console.log("Sending delete request with IDs:", productIds);
      const response = await deleteBulkProducts(productIds);
      console.log("Delete response:", response);

      if (response && response.success) {
        toast.success(
          response.message || "Các sản phẩm đã được xóa thành công"
        );
        // Clear selections and refresh products
        setSelectedProducts({});
        fetchProducts(pagination.page);
      } else {
        toast.error(response?.message || "Không thể xóa sản phẩm");
      }
    } catch (error) {
      console.error("Error deleting products:", error);
      let errorMessage = "Lỗi không xác định";

      if (error.response) {
        // The request was made and the server responded with an error status
        console.error("Server response:", error.response.data);
        errorMessage =
          error.response.data?.message ||
          `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Không nhận được phản hồi từ máy chủ";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || "Lỗi không xác định";
      }

      toast.error("Không thể xóa sản phẩm: " + errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Count selected products
  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;

  // Are all products selected?
  const allSelected = products.length > 0 && selectedCount === products.length;

  useEffect(() => {
    fetchProducts();
    // Reset selections when delete mode is turned off
    if (!isDeleteMode) {
      setSelectedProducts({});
    }
  }, [isDeleteMode, fetchProducts]);

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return <div className="text-red-500 p-10 text-center">{error}</div>;
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Xác nhận xóa sản phẩm"
        message={
          isBulkDelete
            ? `Bạn có chắc chắn muốn xóa ${selectedCount} sản phẩm đã chọn? Hành động này không thể hoàn tác.`
            : `Bạn có chắc chắn muốn xóa sản phẩm "${
                productToDelete?.name || ""
              }"? Hành động này không thể hoàn tác.`
        }
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={isBulkDelete ? handleBulkDelete : handleDeleteConfirm}
        onCancel={handleCancelDelete}
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Quản Lý Sản Phẩm
          </h1>
          <p className="text-gray-500">
            Tổng số sản phẩm: {pagination.total}
            {isDeleteMode &&
              selectedCount > 0 &&
              ` (Đã chọn: ${selectedCount})`}
          </p>
        </div>
        <div className="flex gap-2">
          {isDeleteMode ? (
            <>
              <button
                onClick={() => setIsDeleteMode(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>{" "}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  openConfirmDeleteModal();
                }}
                type="button"
                disabled={selectedCount === 0 || deleteLoading}
                className={`px-4 py-2 rounded-md inline-flex items-center ${
                  selectedCount === 0 || deleteLoading
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {deleteLoading ? (
                  <span className="inline-block mr-2 animate-spin">⏳</span>
                ) : (
                  <IoMdTrash className="mr-2" />
                )}
                Xóa {selectedCount > 0 ? selectedCount : ""} sản phẩm
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsDeleteMode(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md inline-flex items-center hover:bg-red-700"
              >
                <IoMdTrash className="mr-2" />
                Xóa hàng loạt
              </button>
              <Link
                to="/admin/products/create"
                className="bg-white text-black px-4 py-2 rounded-md inline-flex items-center hover:bg-gray-100"
              >
                <IoMdAddCircleOutline className="mr-2" />
                Thêm sản phẩm
              </Link>
            </>
          )}
        </div>
      </div>

      <div>
        {products.length > 0 ? (
          <>
            {" "}
            {isDeleteMode && (
              <div className="flex items-center mb-4 p-2 bg-gray-100 rounded">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSelectAll();
                  }}
                  type="button"
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  {allSelected ? (
                    <BsCheckSquare size={20} className="mr-2 text-blue-500" />
                  ) : (
                    <BsSquare size={20} className="mr-2" />
                  )}
                  {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                </button>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {isDeleteMode && (
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 w-10">
                        Chọn
                      </th>
                    )}
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Ảnh
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Tên Sản Phẩm
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Mô tả
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Danh mục
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Nhãn hàng
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Giá
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Tồn kho
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Đã bán
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      ID
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      {isDeleteMode && (
                        <td className="px-4 py-4 w-10">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleProductSelection(product._id);
                            }}
                            className="cursor-pointer"
                          >
                            {selectedProducts[product._id] ? (
                              <BsCheckSquare
                                size={20}
                                className="text-blue-500"
                              />
                            ) : (
                              <BsSquare size={20} className="text-gray-500" />
                            )}
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-4">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
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
                          to={`/admin/products/${product._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {product.description?.length > 50
                          ? product.description.substring(0, 50) + "..."
                          : product.description || ""}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {product.category?.name || ""}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {product.brand?.name || ""}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <ProductPrice
                          product={product}
                          size="sm"
                          showDiscount={true}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {product.stock}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {product.sold || 0}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {product._id}
                      </td>
                      <td className="px-4 py-4 text-right space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/products/update/${product._id}`);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(product);
                          }}
                          className="text-red-600 hover:text-red-800"
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
                    onClick={() => fetchProducts(pagination.page - 1)}
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
                          onClick={() => fetchProducts(page)}
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
                    onClick={() => fetchProducts(pagination.page + 1)}
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
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

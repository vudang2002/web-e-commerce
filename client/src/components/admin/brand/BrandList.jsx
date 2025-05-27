import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getBrands,
  deleteBrand,
  deleteBulkBrands,
} from "../../../services/brandService";
import { AiOutlineLoading3Quarters, AiOutlinePlus } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdTrash } from "react-icons/io";
import { BsCheckSquare, BsSquare } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../../common/ConfirmModal";
import Pagination from "../../common/Pagination";

const BrandList = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getBrands();
      if (response?.success && Array.isArray(response.data)) {
        setBrands(response.data);
        // Tính toán số trang
        setTotalPages(Math.ceil(response.data.length / 10));
      } else {
        setError("Không thể tải danh sách nhãn hàng");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tải danh sách nhãn hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
    // Reset selections when delete mode is turned off
    if (!isDeleteMode) {
      setSelectedBrands({});
    }
  }, [isDeleteMode, fetchBrands]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (brand) => {
    setBrandToDelete(brand);
    setIsDeleteModalOpen(true);
    setIsBulkDelete(false);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;

    try {
      const response = await deleteBrand(brandToDelete._id);
      if (response?.success) {
        toast.success("Xóa nhãn hàng thành công!");
        fetchBrands();
      } else {
        toast.error(
          "Xóa nhãn hàng thất bại: " +
            (response?.message || "Lỗi không xác định")
        );
      }
    } catch (err) {
      toast.error("Lỗi khi xóa: " + (err.message || "Lỗi không xác định"));
    } finally {
      setIsDeleteModalOpen(false);
      setBrandToDelete(null);
    }
  };

  // Toggle selection of a brand
  const toggleBrandSelection = (brandId) => {
    if (isDeleteMode) {
      setSelectedBrands((prev) => ({
        ...prev,
        [brandId]: !prev[brandId],
      }));
    }
  };

  // Toggle select all brands
  const toggleSelectAll = () => {
    if (
      Object.values(selectedBrands).every((val) => val) &&
      Object.keys(selectedBrands).length === currentBrands.length
    ) {
      // If all are selected, deselect all
      setSelectedBrands({});
    } else {
      // Otherwise, select all
      const allSelected = {};
      currentBrands.forEach((brand) => {
        allSelected[brand._id] = true;
      });
      setSelectedBrands(allSelected);
    }
  };

  // Mở modal xác nhận xóa hàng loạt
  const openConfirmDeleteModal = () => {
    const brandIds = Object.entries(selectedBrands)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);

    if (brandIds.length === 0) {
      toast.warning("Không có nhãn hàng nào được chọn");
      return;
    }

    setIsBulkDelete(true);
    setShowConfirmModal(true);
  };

  // Hủy xóa sản phẩm
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  // Xử lý xóa hàng loạt
  const handleBulkDelete = async () => {
    const brandIds = Object.entries(selectedBrands)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);

    if (brandIds.length === 0) {
      toast.warning("Không có nhãn hàng nào được chọn");
      return;
    }

    setDeleteLoading(true);
    setShowConfirmModal(false); // Đóng modal xác nhận

    try {
      const response = await deleteBulkBrands(brandIds);

      if (response && response.success) {
        toast.success(
          response.message || "Các nhãn hàng đã được xóa thành công"
        );
        // Clear selections and refresh brands
        setSelectedBrands({});
        fetchBrands();
      } else {
        toast.error(response?.message || "Không thể xóa nhãn hàng");
      }
    } catch (error) {
      console.error("Error deleting brands:", error);
      let errorMessage = "Lỗi không xác định";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "Không nhận được phản hồi từ máy chủ";
      } else {
        errorMessage = error.message || "Lỗi không xác định";
      }

      toast.error("Không thể xóa nhãn hàng: " + errorMessage);
    } finally {
      setDeleteLoading(false);
      setIsDeleteMode(false);
    }
  };
  // Phân trang dữ liệu
  const brandsPerPage = 10;
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);

  // Count selected brands
  const selectedCount = Object.values(selectedBrands).filter(Boolean).length;

  // Are all brands selected?
  const allSelected =
    currentBrands.length > 0 &&
    Object.keys(selectedBrands).length === currentBrands.length &&
    Object.values(selectedBrands).every(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <AiOutlineLoading3Quarters className="animate-spin mr-2 text-blue-600" />
        <span>Đang tải danh sách nhãn hàng...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-600 p-4 rounded-md">{error}</div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {" "}
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Modal xác nhận xóa hàng loạt */}
      {isBulkDelete ? (
        <ConfirmModal
          isOpen={showConfirmModal}
          title="Xác nhận xóa nhãn hàng"
          message={`Bạn có chắc chắn muốn xóa ${selectedCount} nhãn hàng đã chọn? Hành động này không thể hoàn tác.`}
          confirmText="Xóa"
          cancelText="Hủy"
          onConfirm={handleBulkDelete}
          onCancel={handleCancelDelete}
        />
      ) : null}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Quản Lý Nhãn Hàng
          </h1>
          <p className="text-gray-500">
            Tổng số nhãn hàng: {brands.length}
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
                onClick={openConfirmDeleteModal}
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
                Xóa {selectedCount > 0 ? selectedCount : ""} nhãn hàng
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
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={() => navigate("/admin/brands/create")}
              >
                <AiOutlinePlus className="mr-2" />
                Thêm Nhãn Hàng
              </button>
            </>
          )}
        </div>
      </div>
      {/* Brands List */}
      {brands.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded">
          <p className="text-gray-500">Chưa có nhãn hàng nào</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={() => navigate("/admin/brands/create")}
          >
            Thêm nhãn hàng đầu tiên
          </button>
        </div>
      ) : (
        <>
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
                    Logo
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Tên Nhãn Hàng
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
                {currentBrands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-gray-50">
                    {isDeleteMode && (
                      <td className="px-4 py-4 w-10">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBrandSelection(brand._id);
                          }}
                          className="cursor-pointer"
                        >
                          {selectedBrands[brand._id] ? (
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
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
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
                        to={`/admin/brands/detail/${brand._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {brand.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {brand.description
                        ? brand.description.length > 50
                          ? `${brand.description.substring(0, 50)}...`
                          : brand.description
                        : ""}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {brand._id}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {brand.slug}
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/brands/edit/${brand._id}`);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(brand);
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

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
      {/* Confirm Delete Modal for single brand */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Xác nhận xóa nhãn hàng"
        message={`Bạn có chắc chắn muốn xóa nhãn hàng "${
          brandToDelete?.name || ""
        }"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setBrandToDelete(null);
        }}
      />
    </div>
  );
};

export default BrandList;

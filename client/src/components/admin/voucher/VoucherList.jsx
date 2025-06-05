import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteVoucher } from "../../../services/voucherService";
import { useVouchers } from "../../../hooks/useProductData";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FiChevronLeft, FiChevronRight, FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../../common/ConfirmModal";

const VoucherList = () => {
  // Sử dụng hook useVouchers để fetch dữ liệu
  const {
    data: vouchersData,
    isLoading,
    error: queryError,
    refetch,
  } = useVouchers();

  const [vouchers, setVouchers] = useState([]);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 0,
  });

  // Cập nhật vouchers khi data từ hook thay đổi
  useEffect(() => {
    if (vouchersData) {
      setVouchers(vouchersData);
      setPagination((prev) => ({
        ...prev,
        total: vouchersData.length,
        totalPages: Math.ceil(vouchersData.length / prev.limit),
      }));
      setError(null);
    }
    if (queryError) {
      setError(queryError.message || "Error fetching vouchers");
    }
  }, [vouchersData, queryError]);

  // Tính toán dữ liệu cho trang hiện tại
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const currentPageVouchers = vouchers.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleDeleteClick = (voucher) => {
    setVoucherToDelete(voucher);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!voucherToDelete) return;

    try {
      const response = await deleteVoucher(voucherToDelete._id);
      if (response?.success) {
        toast.success("Xóa voucher thành công!");
        refetch(); // Refresh dữ liệu sau khi xóa
      } else {
        toast.error(
          "Xóa voucher thất bại: " + (response?.message || "Lỗi không xác định")
        );
      }
    } catch (err) {
      toast.error("Lỗi khi xóa: " + (err.message || "Lỗi không xác định"));
    } finally {
      setIsDeleteModalOpen(false);
      setVoucherToDelete(null);
    }
  };

  // Helper function để format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };
  // Helper function để format giá trị giảm giá
  const formatDiscount = (voucher) => {
    const discountValue = voucher.discountValue || voucher.amount || 0;
    if (voucher.discountType === "percentage") {
      return `${discountValue}%`;
    } else {
      return `${Number(discountValue).toLocaleString("vi-VN")}đ`;
    }
  };

  // Helper function để kiểm tra trạng thái voucher
  const getVoucherStatus = (voucher) => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    if (!voucher.isActive) {
      return { status: "Tạm dừng", color: "bg-gray-500" };
    }
    if (now < startDate) {
      return { status: "Chưa bắt đầu", color: "bg-yellow-500" };
    }
    if (now > endDate) {
      return { status: "Hết hạn", color: "bg-red-500" };
    }
    if (voucher.usedCount >= voucher.maxUses) {
      return { status: "Hết lượt", color: "bg-orange-500" };
    }
    return { status: "Đang hoạt động", color: "bg-green-500" };
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
            Quản Lý Voucher
          </h1>
          <p className="text-gray-500 mt-1">
            Tổng số voucher: {pagination.total} voucher
          </p>
        </div>
        <div>
          <Link
            to="/admin/vouchers/create"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <IoMdAddCircleOutline className="mr-2" />
            Thêm Voucher
          </Link>
        </div>
      </div>

      <div>
        {currentPageVouchers.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Mã Code
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Tên Voucher
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Giảm giá
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Hạn sử dụng
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Đã sử dụng
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Trạng thái
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPageVouchers.map((voucher) => {
                    const statusInfo = getVoucherStatus(voucher);
                    return (
                      <tr key={voucher._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 font-mono text-sm font-medium">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {voucher.code}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-medium">
                          <Link
                            to={`/admin/vouchers/${voucher._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {voucher.title}
                          </Link>
                          {voucher.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {voucher.description.length > 40
                                ? `${voucher.description.substring(0, 40)}...`
                                : voucher.description}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className="font-semibold text-green-600">
                            {formatDiscount(voucher)}
                          </span>{" "}
                          {voucher.maxDiscountAmount &&
                            voucher.discountType === "percentage" && (
                              <p className="text-xs text-gray-500">
                                Tối đa:{" "}
                                {Number(
                                  voucher.maxDiscountAmount
                                ).toLocaleString("vi-VN")}
                                đ
                              </p>
                            )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <div>
                            <div>Từ: {formatDate(voucher.startDate)}</div>
                            <div>Đến: {formatDate(voucher.endDate)}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-center">
                          <span className="font-medium">
                            {voucher.usedCount}/{voucher.maxUses}
                          </span>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (voucher.usedCount / voucher.maxUses) * 100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${statusInfo.color}`}
                          >
                            {statusInfo.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right space-x-2">
                          <Link
                            to={`/admin/vouchers/update/${voucher._id}`}
                            className="text-blue-600 hover:text-blue-800 inline-block"
                          >
                            <FiEdit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(voucher)}
                            className="text-red-600 hover:text-red-800 inline-block"
                          >
                            <RiDeleteBin6Line size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
            <p className="text-gray-500">Chưa có voucher nào</p>
            <Link
              to="/admin/vouchers/create"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition inline-block"
            >
              Thêm voucher đầu tiên
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && voucherToDelete && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa voucher "${voucherToDelete.title}" (${voucherToDelete.code}) không?`}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default VoucherList;

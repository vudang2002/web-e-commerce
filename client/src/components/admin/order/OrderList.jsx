import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteOrder, updateOrderStatus } from "../../../services/orderService";
import { useOrders } from "../../../hooks/useProductData";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiEye,
  FiChevronDown,
} from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../../common/ConfirmModal";

const OrderList = () => {
  // Sử dụng hook useOrders để fetch dữ liệu
  const {
    data: ordersData,
    isLoading,
    error: queryError,
    refetch,
  } = useOrders();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 0,
  });

  // Cập nhật orders khi data từ hook thay đổi
  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData);
      setPagination((prev) => ({
        ...prev,
        total: ordersData.length,
        totalPages: Math.ceil(ordersData.length / prev.limit),
      }));
      setError(null);
    }
    if (queryError) {
      setError(queryError.message || "Error fetching orders");
    }
  }, [ordersData, queryError]);

  // Tính toán dữ liệu cho trang hiện tại
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const currentPageOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    try {
      const response = await deleteOrder(orderToDelete._id);
      if (response?.success) {
        toast.success("Xóa đơn hàng thành công!");
        refetch(); // Refresh dữ liệu sau khi xóa
      } else {
        toast.error(
          "Xóa đơn hàng thất bại: " +
            (response?.message || "Lỗi không xác định")
        );
      }
    } catch (err) {
      toast.error("Lỗi khi xóa: " + (err.message || "Lỗi không xác định"));
    } finally {
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  // Toggle dropdown trạng thái
  const toggleStatusDropdown = (orderId) => {
    setStatusDropdownOpen((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Cập nhật trạng thái đơn hàng
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));

    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response?.success) {
        toast.success("Cập nhật trạng thái thành công!");
        refetch(); // Refresh dữ liệu sau khi cập nhật
      } else {
        toast.error(
          "Cập nhật trạng thái thất bại: " +
            (response?.message || "Lỗi không xác định")
        );
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật: " + (err.message || "Lỗi không xác định"));
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }));
      setStatusDropdownOpen((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".status-dropdown")) {
        setStatusDropdownOpen({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper function để format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Helper function để format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Helper function để lấy màu trạng thái
  const getStatusColor = (status) => {
    const statusColors = {
      Processing: "bg-yellow-100 text-yellow-800",
      Confirmed: "bg-blue-100 text-blue-800",
      Shipping: "bg-purple-100 text-purple-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
      Failed: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };
  // Helper function để lấy màu phương thức thanh toán
  const getPaymentMethodColor = (method) => {
    return method === "COD"
      ? "bg-orange-100 text-orange-800"
      : "bg-green-100 text-green-800";
  };

  // Danh sách các trạng thái có thể chọn
  const orderStatuses = [
    {
      value: "Processing",
      label: "Đang xử lý",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "Confirmed",
      label: "Đã xác nhận",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "Shipping",
      label: "Đang giao",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "Delivered",
      label: "Đã giao",
      color: "bg-green-100 text-green-800",
    },
    { value: "Cancelled", label: "Đã hủy", color: "bg-red-100 text-red-800" },
    { value: "Failed", label: "Thất bại", color: "bg-gray-100 text-gray-800" },
  ];

  // Helper function để lấy label trạng thái
  const getStatusLabel = (status) => {
    const statusObj = orderStatuses.find((s) => s.value === status);
    return statusObj ? statusObj.label : status;
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
            Quản Lý Đơn Hàng
          </h1>
          <p className="text-gray-500 mt-1">
            Tổng số đơn hàng: {pagination.total} đơn hàng
          </p>
        </div>
        <div>
          <Link
            to="/admin/orders/create"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <IoMdAddCircleOutline className="mr-2" />
            Thêm Đơn Hàng
          </Link>
        </div>
      </div>

      <div>
        {currentPageOrders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Mã Đơn Hàng
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Khách Hàng
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Tổng Tiền
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Phương Thức
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Ngày Tạo
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Trạng Thái
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPageOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          #{order._id.slice(-8)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {order.user?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email || ""}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalPrice)}
                        </div>
                        {order.voucherDiscount > 0 && (
                          <div className="text-xs text-green-600">
                            Giảm: {formatCurrency(order.voucherDiscount)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(
                            order.paymentMethod
                          )}`}
                        >
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>{" "}
                      <td className="px-4 py-3">
                        <div className="relative status-dropdown">
                          <button
                            onClick={() => toggleStatusDropdown(order._id)}
                            disabled={updatingStatus[order._id]}
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              order.orderStatus
                            )} hover:opacity-80 transition-opacity ${
                              updatingStatus[order._id]
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            {updatingStatus[order._id] ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent mr-1"></div>
                                Đang cập nhật...
                              </>
                            ) : (
                              <>
                                {getStatusLabel(order.orderStatus)}
                                <FiChevronDown className="ml-1 h-3 w-3" />
                              </>
                            )}
                          </button>

                          {statusDropdownOpen[order._id] && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[140px]">
                              {orderStatuses.map((status) => (
                                <button
                                  key={status.value}
                                  onClick={() =>
                                    handleStatusUpdate(order._id, status.value)
                                  }
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                    order.orderStatus === status.value
                                      ? "bg-blue-50 text-blue-600 font-medium"
                                      : "text-gray-700"
                                  }`}
                                >
                                  <span
                                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                      status.color.split(" ")[0]
                                    }`}
                                  ></span>
                                  {status.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FiEye size={18} />
                          </Link>
                          <Link
                            to={`/admin/orders/${order._id}/edit`}
                            className="text-green-600 hover:text-green-800"
                          >
                            <FiEdit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(order)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <RiDeleteBin6Line size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
            <p className="text-gray-500">Chưa có đơn hàng nào</p>
            <Link
              to="/admin/orders/create"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition inline-block"
            >
              Thêm đơn hàng đầu tiên
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && orderToDelete && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa đơn hàng "#${orderToDelete._id.slice(
            -8
          )}" không?`}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default OrderList;

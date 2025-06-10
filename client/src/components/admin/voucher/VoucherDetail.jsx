import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useVoucherDetail } from "../../../hooks/useProductData";
import {
  FiEdit,
  FiCalendar,
  FiPercent,
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiActivity,
} from "react-icons/fi";
import { BsCheckCircle, BsXCircle, BsPause } from "react-icons/bs";

const VoucherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: voucher, isLoading, error } = useVoucherDetail(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">
          Đang tải thông tin voucher...
        </span>
      </div>
    );
  }

  if (error || !voucher) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-10">
          <div className="text-red-500 text-lg font-medium mb-2">
            Không thể tải thông tin voucher
          </div>
          <div className="text-gray-500 mb-4">
            {error?.message || "Voucher không tồn tại hoặc đã bị xóa"}
          </div>
          <button
            onClick={() => navigate("/admin/vouchers")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDiscount = () => {
    const discountValue = voucher.discountValue || voucher.amount;
    if (voucher.discountType === "percentage") {
      return `${discountValue}%`;
    } else {
      return `${Number(discountValue || 0).toLocaleString("vi-VN")}đ`;
    }
  };

  const getVoucherStatus = () => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate || voucher.expireAt);

    if (!voucher.isActive) {
      return { status: "Tạm dừng", color: "bg-gray-500", icon: BsPause };
    }
    if (now < startDate) {
      return {
        status: "Chưa bắt đầu",
        color: "bg-yellow-500",
        icon: FiCalendar,
      };
    }
    if (now > endDate) {
      return { status: "Hết hạn", color: "bg-red-500", icon: BsXCircle };
    }
    const maxUses = voucher.maxUses || voucher.usageLimit;
    if (maxUses && voucher.usedCount >= maxUses) {
      return { status: "Hết lượt", color: "bg-orange-500", icon: BsXCircle };
    }
    return {
      status: "Đang hoạt động",
      color: "bg-green-500",
      icon: BsCheckCircle,
    };
  };

  const statusInfo = getVoucherStatus();
  const StatusIcon = statusInfo.icon;
  const usagePercentage =
    voucher.maxUses || voucher.usageLimit
      ? Math.min(
          (voucher.usedCount / (voucher.maxUses || voucher.usageLimit)) * 100,
          100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">
                {voucher.title || "Chi tiết Voucher"}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${statusInfo.color}`}
              >
                <StatusIcon className="mr-1" size={14} />
                {statusInfo.status}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-mono text-lg font-semibold">
                {voucher.code}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/admin/vouchers/update/${voucher._id}`}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <FiEdit className="mr-2" size={16} />
              Chỉnh sửa
            </Link>
            <button
              onClick={() => navigate("/admin/vouchers")}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Quay lại
            </button>
          </div>
        </div>

        {voucher.description && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{voucher.description}</p>
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Discount Value */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {voucher.discountType === "percentage" ? (
                <FiPercent className="h-8 w-8 text-green-600" />
              ) : (
                <FiDollarSign className="h-8 w-8 text-green-600" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Giá trị giảm</p>
              <p className="text-2xl font-bold text-green-600">
                {formatDiscount()}
              </p>{" "}
              {voucher.maxDiscountAmount &&
                voucher.discountType === "percentage" && (
                  <p className="text-xs text-gray-500">
                    Tối đa:{" "}
                    {Number(voucher.maxDiscountAmount).toLocaleString("vi-VN")}đ
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Min Order */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đơn tối thiểu</p>{" "}
              <p className="text-2xl font-bold text-blue-600">
                {Number(
                  voucher.minOrderAmount || voucher.minOrderValue || 0
                ).toLocaleString("vi-VN")}
                đ
              </p>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiUsers className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đã sử dụng</p>
              <p className="text-2xl font-bold text-purple-600">
                {voucher.usedCount} /{" "}
                {voucher.maxUses || voucher.usageLimit || "∞"}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Percentage */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiActivity className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tỷ lệ sử dụng</p>
              <p className="text-2xl font-bold text-orange-600">
                {usagePercentage.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voucher Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Thông tin voucher
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Mã voucher:</span>
              <span className="font-mono font-semibold">{voucher.code}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Loại giảm giá:</span>
              <span className="font-medium">
                {voucher.discountType === "percentage"
                  ? "Phần trăm"
                  : "Số tiền cố định"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Giá trị:</span>
              <span className="font-semibold text-green-600">
                {formatDiscount()}
              </span>
            </div>
            {voucher.maxDiscountAmount &&
              voucher.discountType === "percentage" && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Giảm tối đa:</span>{" "}
                  <span className="font-medium">
                    {Number(voucher.maxDiscountAmount || 0).toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </span>
                </div>
              )}
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Đơn hàng tối thiểu:</span>
              <span className="font-medium">
                {Number(
                  voucher.minOrderAmount || voucher.minOrderValue || 0
                ).toLocaleString("vi-VN")}
                đ
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Trạng thái:</span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color}`}
              >
                <StatusIcon className="mr-1" size={12} />
                {statusInfo.status}
              </span>
            </div>
          </div>
        </div>

        {/* Usage & Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Thời gian & Sử dụng
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Ngày tạo:</span>
              <span className="font-medium">
                {formatDate(voucher.createdAt)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Ngày bắt đầu:</span>
              <span className="font-medium">
                {formatDate(voucher.startDate)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Ngày kết thúc:</span>
              <span className="font-medium">
                {formatDate(voucher.endDate || voucher.expireAt)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Lượt sử dụng:</span>
              <span className="font-medium">
                {voucher.usedCount} /{" "}
                {voucher.maxUses || voucher.usageLimit || "Không giới hạn"}
              </span>
            </div>

            {/* Usage Progress Bar */}
            {(voucher.maxUses || voucher.usageLimit) && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Tiến độ sử dụng</span>
                  <span className="font-medium">
                    {usagePercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex justify-between py-2">
              <span className="text-gray-600">Cập nhật cuối:</span>
              <span className="font-medium">
                {formatDate(voucher.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherDetail;

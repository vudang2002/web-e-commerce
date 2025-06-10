import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getOrderById,
  updateOrderStatus,
} from "../../../services/orderService";
import {
  FiArrowLeft,
  FiEdit,
  FiPackage,
  FiUser,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await getOrderById(id);
      if (response?.success) {
        setOrder(response.data);
        setNewStatus(response.data.orderStatus);
      } else {
        toast.error("Không tìm thấy đơn hàng");
        navigate("/admin/orders");
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin đơn hàng: " + error.message);
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === order.orderStatus) return;

    setUpdating(true);
    try {
      const response = await updateOrderStatus(id, { orderStatus: newStatus });
      if (response?.success) {
        toast.success("Cập nhật trạng thái thành công!");
        setOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      } else {
        toast.error("Cập nhật trạng thái thất bại");
        setNewStatus(order.orderStatus);
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật: " + error.message);
      setNewStatus(order.orderStatus);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      Shipping: "bg-purple-100 text-purple-800 border-purple-200",
      Delivered: "bg-green-100 text-green-800 border-green-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
      Failed: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Không tìm thấy đơn hàng</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin/orders")}
            className="mr-4 p-2 hover:bg-gray-100 rounded"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Chi Tiết Đơn Hàng #{order._id.slice(-8)}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Tạo lúc: {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <Link
          to={`/admin/orders/${order._id}/edit`}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FiEdit className="mr-2" size={16} />
          Chỉnh sửa
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <FiPackage className="mr-2" />
              Trạng Thái Đơn Hàng
            </h3>

            <div className="flex items-center gap-4">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                  newStatus
                )}`}
              >
                <option value="Processing">Đang xử lý</option>
                <option value="Confirmed">Đã xác nhận</option>
                <option value="Shipping">Đang giao hàng</option>
                <option value="Delivered">Đã giao hàng</option>
                <option value="Cancelled">Đã hủy</option>
                <option value="Failed">Thất bại</option>
              </select>

              {newStatus !== order.orderStatus && (
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {updating ? "Đang cập nhật..." : "Cập nhật"}
                </button>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Sản Phẩm</h3>

            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.product?.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FiPackage size={24} className="text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {item.product?.name || "Sản phẩm không tồn tại"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity} x{" "}
                      {formatCurrency(item.product?.price || item.price)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      {formatCurrency(
                        item.quantity * item.product?.price || item.price
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>
                    {formatCurrency(
                      order.totalPrice -
                        (order.shippingCost || 0) +
                        (order.voucherDiscount || 0)
                    )}
                  </span>
                </div>

                {order.voucherDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá voucher:</span>
                    <span>-{formatCurrency(order.voucherDiscount)}</span>
                  </div>
                )}

                {order.shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span>{formatCurrency(order.shippingCost)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Ghi Chú
              </h3>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <FiUser className="mr-2" />
              Thông Tin Khách Hàng
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Tên khách hàng</p>
                <p className="font-medium">{order.user?.name || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{order.user?.email || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">
                  {order.shippingInfo?.phoneNo || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <FiMapPin className="mr-2" />
              Địa Chỉ Giao Hàng
            </h3>

            <div className="space-y-2 text-sm">
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}</p>
              <p>{order.shippingAddress?.state}</p>
              <p>{order.shippingAddress?.zipCode}</p>
              <p>{order.shippingInfo?.address || "Vietnam"}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <FiCreditCard className="mr-2" />
              Thanh Toán
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Phương thức</p>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.paymentMethod === "COD"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {order.paymentMethod}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.paymentStatus === "Paid"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserById,
  deleteUser,
  updateUserRole,
  updateSellerStatus,
} from "../../../services/userService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../../common/ConfirmModal";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [isSellerStatusModalOpen, setIsSellerStatusModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await getUserById(id);
        if (response?.success && response.data) {
          setUser(response.data);
          setSelectedRole(response.data.role || "user");
        } else {
          setError("Không tìm thấy người dùng");
        }
      } catch (err) {
        setError(err.message || "Lỗi khi lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await deleteUser(id);
      if (response?.success) {
        toast.success("Xóa người dùng thành công!");
        setTimeout(() => {
          navigate("/admin/users");
        }, 1500);
      } else {
        toast.error("Xóa người dùng thất bại");
      }
    } catch (err) {
      toast.error(err.message || "Lỗi khi xóa người dùng");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleChangeRole = async () => {
    try {
      const response = await updateUserRole(id, selectedRole);
      if (response?.success) {
        toast.success("Cập nhật vai trò thành công!");
        // Cập nhật user state để hiển thị đúng thông tin mới
        setUser({
          ...user,
          role: selectedRole,
        });
      } else {
        toast.error("Cập nhật vai trò thất bại");
      }
    } catch (err) {
      toast.error(err.message || "Lỗi khi cập nhật vai trò");
    } finally {
      setIsChangeRoleModalOpen(false);
    }
  };

  const handleToggleSellerStatus = async () => {
    try {
      const newStatus = !user.isSeller;
      const response = await updateSellerStatus(id, newStatus);
      if (response?.success) {
        toast.success(
          `${newStatus ? "Kích hoạt" : "Hủy"} tài khoản bán hàng thành công!`
        );
        // Cập nhật user state để hiển thị đúng thông tin mới
        setUser({
          ...user,
          isSeller: newStatus,
        });
      } else {
        toast.error("Cập nhật trạng thái bán hàng thất bại");
      }
    } catch (err) {
      toast.error(err.message || "Lỗi khi cập nhật trạng thái bán hàng");
    } finally {
      setIsSellerStatusModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <AiOutlineLoading3Quarters className="animate-spin mr-2 text-blue-600" />
        <span>Đang tải thông tin người dùng...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-600 p-4 m-6 rounded">{error}</div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${user.name}" không? Hành động này không thể hoàn tác.`}
      />

      {/* Change Role Modal */}
      <ConfirmModal
        isOpen={isChangeRoleModalOpen}
        onClose={() => setIsChangeRoleModalOpen(false)}
        onConfirm={handleChangeRole}
        title="Đổi vai trò người dùng"
        message={
          <div>
            <p className="mb-4">Chọn vai trò mới cho người dùng {user.name}:</p>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>
        }
      />

      {/* Toggle Seller Status Modal */}
      <ConfirmModal
        isOpen={isSellerStatusModalOpen}
        onClose={() => setIsSellerStatusModalOpen(false)}
        onConfirm={handleToggleSellerStatus}
        title={
          user.isSeller
            ? "Hủy tài khoản bán hàng"
            : "Kích hoạt tài khoản bán hàng"
        }
        message={
          user.isSeller
            ? `Bạn có chắc chắn muốn hủy tài khoản bán hàng của "${user.name}" không?`
            : `Bạn có chắc chắn muốn kích hoạt tài khoản bán hàng cho "${user.name}" không?`
        }
      />

      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Chi Tiết Người Dùng
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/admin/users/update/${id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
          >
            <FiEdit className="mr-1" /> Chỉnh sửa
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center"
          >
            <RiDeleteBin6Line className="mr-1" /> Xóa
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - User Avatar */}
          <div>
            <div className="mb-4 text-lg font-medium text-gray-700">
              Ảnh đại diện
            </div>
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="max-w-full h-auto max-h-56 rounded-full"
                />
              ) : (
                <div className="h-56 w-56 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-500 font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - User Information */}
          <div className="space-y-4 md:col-span-2">
            <div>
              <div className="mb-2 text-sm font-medium text-gray-500">
                Họ và tên
              </div>
              <div className="text-lg font-medium">{user.name}</div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-gray-500">
                Email
              </div>
              <div>{user.email}</div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-gray-500">
                Vai trò
              </div>
              <div className="flex items-center">
                <div className="mr-2">
                  {user.role === "admin" && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      Admin
                    </span>
                  )}
                  {user.role === "staff" && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Nhân viên
                    </span>
                  )}
                  {(!user.role || user.role === "user") && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      Người dùng
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsChangeRoleModalOpen(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Đổi vai trò
                </button>
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-gray-500">
                Trạng thái bán hàng
              </div>
              <div className="flex items-center">
                <div className="mr-2">
                  {user.isSeller ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Đã kích hoạt
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      Chưa kích hoạt
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsSellerStatusModalOpen(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {user.isSeller
                    ? "Hủy tài khoản bán hàng"
                    : "Kích hoạt tài khoản bán hàng"}
                </button>
              </div>
            </div>

            {user.isSeller && (
              <>
                <div>
                  <div className="mb-2 text-sm font-medium text-gray-500">
                    Tên cửa hàng
                  </div>
                  <div>{user.storeName || "Chưa thiết lập"}</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-gray-500">
                    Mô tả cửa hàng
                  </div>
                  <div>{user.storeDescription || "Chưa có mô tả"}</div>
                </div>
              </>
            )}

            <div>
              <div className="mb-2 text-sm font-medium text-gray-500">
                Ngày tạo tài khoản
              </div>
              <div>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-gray-500">
                Lần cập nhật cuối
              </div>
              <div>
                {user.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 px-6 py-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Quay Lại Danh Sách
        </button>
      </div>
    </div>
  );
};

export default UserDetail;

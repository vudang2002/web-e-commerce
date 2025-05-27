import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../../../services/userService";
import { AiOutlineLoading3Quarters, AiOutlinePlus } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../../common/ConfirmModal";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async (page = 1) => {
    // Kiểm tra giới hạn trang
    if (page < 1) page = 1;
    if (pagination.totalPages && page > pagination.totalPages)
      page = pagination.totalPages;

    setLoading(true);
    try {
      // Lấy dữ liệu người dùng với phân trang
      const response = await getUsers(
        `?page=${page}&limit=${pagination.limit}`
      );
      if (response?.success && Array.isArray(response.data)) {
        setUsers(response.data);
        setPagination({
          page: response.page || page,
          limit: response.limit || pagination.limit,
          total: response.total || response.data.length,
          totalPages: Math.ceil(
            (response.total || response.data.length) /
              (response.limit || pagination.limit)
          ),
        });
      } else {
        setError("Không thể tải danh sách người dùng");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const response = await deleteUser(userToDelete._id);
      if (response?.success) {
        toast.success("Xóa người dùng thành công!");
        fetchUsers(pagination.page); // Tải lại danh sách với trang hiện tại
      } else {
        toast.error(
          "Xóa người dùng thất bại: " +
            (response?.message || "Lỗi không xác định")
        );
      }
    } catch (err) {
      toast.error(
        "Lỗi khi xóa người dùng: " + (err.message || "Lỗi không xác định")
      );
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Phân trang khi API không hỗ trợ
  const currentUsers = users;
  // const indexOfLastUser = pagination.page * pagination.limit;
  // const indexOfFirstUser = indexOfLastUser - pagination.limit;
  // const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <AiOutlineLoading3Quarters className="animate-spin mr-2 text-blue-600" />
        <span>Đang tải danh sách người dùng...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-600 p-4 rounded-md">{error}</div>
    );
  }

  // Hàm định dạng role để hiển thị
  const formatRole = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            Admin
          </span>
        );
      case "seller":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            Seller
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            User
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Quản Lý Người Dùng
          </h1>
          <p className="text-gray-500 mt-1">
            Tổng số người dùng: {pagination.total} người dùng
          </p>
        </div>
        <div>
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={() => navigate("/admin/users/create")}
          >
            <AiOutlinePlus className="mr-2" />
            Thêm Người Dùng
          </button>
        </div>
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded">
          <p className="text-gray-500">Chưa có người dùng nào</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={() => navigate("/admin/users/create")}
          >
            Thêm người dùng đầu tiên
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Avatar
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Tên Người Dùng
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Vai Trò
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Ngày Tạo
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 object-cover rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded-full">
                          <span className="text-gray-500 text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 font-medium">
                      <Link
                        to={`/admin/users/detail/${user._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {user._id}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {formatRole(user.role)}
                      {user.isSeller && user.role !== "admin" && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Seller
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/users/update/${user._id}`)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
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
          {pagination.totalPages > 1 && (
            <div className="mt-6">
              <div className="flex justify-center">
                <nav className="flex items-center">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`p-2 mx-1 rounded-md ${
                      pagination.page === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    &laquo;
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
                          <span className="px-2 py-1 mx-1">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 mx-1 rounded-md ${
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
                  >
                    &raquo;
                  </button>
                </nav>
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${
          userToDelete?.name || ""
        }" không? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
};

export default UserList;

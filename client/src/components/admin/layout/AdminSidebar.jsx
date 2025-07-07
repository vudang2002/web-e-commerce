import { Link, useLocation } from "react-router-dom";
import {
  FiLayout,
  FiShoppingBag,
  FiFileText,
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiUsers,
  FiTag,
  FiShoppingCart,
  FiMessageCircle,
} from "react-icons/fi";

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 h-screen bg-white border-r px-4 py-6 flex flex-col">
      {/* Logo */}
      <div className="mb-10 flex items-center justify-center">
        <img src="/images/admin-logo.png" alt="logo" className="h-40" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-4 text-sm font-medium">
        <Link
          to="/admin"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin")
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiLayout size={16} />
          Trang Chủ
        </Link>
        <Link
          to="/admin/products"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/products")
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiShoppingBag size={16} />
          Quản Lý Sản Phẩm
        </Link>
        <Link
          to="/admin/orders"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/orders")
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiShoppingCart size={16} />
          Quản Lý Đơn Hàng
        </Link>
        <Link
          to="/admin/users"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/users")
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiUsers size={16} />
          Quản Lý Người Dùng
        </Link>
        <Link
          to="/admin/brands"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/brands")
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiFileText size={16} />
          Quản Lý Thương Hiệu
        </Link>
        <Link
          to="/admin/categories"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/categories")
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiFileText size={16} />
          Quản Lý Danh Mục
        </Link>{" "}
        <Link
          to="/admin/vouchers"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/vouchers")
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiFileText size={16} />
          Quản Lý Voucher
        </Link>
        <Link
          to="/admin/chatbot"
          className={`flex items-center gap-2 px-3 py-2 rounded ${
            isActive("/admin/chatbot")
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiMessageCircle size={16} />
          Quản Lý Chatbot
        </Link>
      </nav>

      {/* Categories */}
    </aside>
  );
};

export default AdminSidebar;

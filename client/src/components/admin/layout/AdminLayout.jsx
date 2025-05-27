import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-400">
      {/* Sidebar full height, stick to top */}
      <div className="h-screen sticky top-0 z-20">
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col">
        {/* Header chạm top */}
        <AdminHeader />
        <main className="p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

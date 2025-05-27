import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AdminProtectedRoute = () => {
  const location = useLocation();
  const { isAdmin, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is admin
  if (!isAdmin()) {
    // Redirect to admin login page, but save the location they were trying to go to
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If they are admin, render the child routes
  return <Outlet />;
};

export default AdminProtectedRoute;

import HomePage from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import routes from "./routes";
import adminRoutes from "./routes/adminRoutes";
import UserLayout from "./components/layout/UserLayout";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/layout/AdminLayout";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import Chatbox from "./components/common/Chatbox";

function App() {
  return (
    <div>
      {/* Add padding to prevent header from overlapping content */}
      <div className=" bg-[#f5f5f5] min-h-screen">
        <Routes>
          <Route element={<UserLayout />}>
            {routes.map(({ path, element }, idx) => (
              <Route key={idx} path={path} element={element} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin routes */}
          <Route path="/admin" element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              {adminRoutes.map(({ path, element }, idx) => (
                <Route key={idx} path={path} element={element} />
              ))}
            </Route>{" "}
          </Route>
        </Routes>
      </div>

      {/* Chatbox - only show on user pages, not admin */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Chatbox />} />
      </Routes>
    </div>
  );
}

export default App;

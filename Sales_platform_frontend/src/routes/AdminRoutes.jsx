import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleRoute from "../components/auth/RoleRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Products from "../pages/admin/Products";
import Categories from "../pages/admin/Categories";
import Customers from "../pages/admin/Customers";
import Orders from "../pages/admin/Orders";
import Inventory from "../pages/admin/Inventory";
import Payments from "../pages/admin/Payments";
import Analytics from "../pages/admin/Analytics";
import Reports from "../pages/admin/Reports";
import Managers from "../pages/admin/Managers";
import Employees from "../pages/admin/Employees";

function AdminRoutes(){
  return (
    <Routes>
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/products" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><Products /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><Categories /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><Customers /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><Orders /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/inventory" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><Inventory /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><Payments /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><Analytics /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><Reports /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/managers" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><Managers /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><Employees /></RoleRoute></ProtectedRoute>} />
    </Routes>
  );
}

export default AdminRoutes;

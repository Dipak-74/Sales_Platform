import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleRoute from "../components/auth/RoleRoute";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import Products from "../pages/manager/Products";
import Categories from "../pages/manager/Categories";
import Customers from "../pages/manager/Customers";
import Orders from "../pages/manager/Orders";
import Inventory from "../pages/manager/Inventory";
import Analytics from "../pages/manager/Analytics";
import Reports from "../pages/manager/Reports";
import Employees from "../pages/manager/Employees";



function ManagerRoutes() {
  
  return (
    <Routes>
      <Route path="/manager/dashboard" element={<ProtectedRoute><RoleRoute allowedRoles={["MANAGER"]}><ManagerDashboard /></RoleRoute></ProtectedRoute>} />
      <Route path="/manager" element={<Navigate to="/manager/dashboard" replace />} />
      <Route path="/manager/products" element={<ProtectedRoute><RoleRoute allowedRoles={["MANAGER"]}><Products /></RoleRoute></ProtectedRoute>} />
      <Route path="/manager/categories" element={<ProtectedRoute><RoleRoute allowedRoles={["MANAGER"]}><Categories /></RoleRoute></ProtectedRoute>} />
      <Route path="/manager/customers" element={<ProtectedRoute><RoleRoute allowedRoles={["MANAGER"]}><Customers /></RoleRoute></ProtectedRoute>} />
      <Route path="/manager/orders" element={<ProtectedRoute><RoleRoute allowedRoles={["MANAGER"]}><Orders /></RoleRoute></ProtectedRoute>} />
      <Route path="/manager/inventory" element={<ProtectedRoute><RoleRoute allowedRoles={["MANAGER"]}><Inventory /></RoleRoute></ProtectedRoute>} />
      <Route path="/manager/analytics" element={<ProtectedRoute><RoleRoute allowedRoles={["MANAGER"]}><Analytics /></RoleRoute></ProtectedRoute>} />
      <Route path="/manager/reports" element={<ProtectedRoute><RoleRoute allowedRoles={["MANAGER"]}><Reports /></RoleRoute></ProtectedRoute>} />
      <Route path="/manager/employees" element={<ProtectedRoute><RoleRoute allowedRoles={["MANAGER"]}><Employees /></RoleRoute></ProtectedRoute>} />
    </Routes>
  );
}

export default ManagerRoutes;

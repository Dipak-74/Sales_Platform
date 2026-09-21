import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleRoute from "../components/auth/RoleRoute";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import Products from "../pages/employee/Products";
import Customers from "../pages/employee/Customers";
import Orders from "../pages/employee/Orders";
import Inventory from "../pages/employee/Inventory";
import Profile from "../pages/employee/Profile";

function EmployeeRoutes() {
  return (
    <Routes>
      <Route path="/employee/dashboard" element={<ProtectedRoute><RoleRoute allowedRoles={["EMPLOYEE"]}><EmployeeDashboard /></RoleRoute></ProtectedRoute>} />
      <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
      <Route path="/employee/products" element={<ProtectedRoute><RoleRoute allowedRoles={["EMPLOYEE"]}><Products /></RoleRoute></ProtectedRoute>} />
      <Route path="/employee/customers" element={<ProtectedRoute><RoleRoute allowedRoles={["EMPLOYEE"]}><Customers /></RoleRoute></ProtectedRoute>} />
      <Route path="/employee/orders" element={<ProtectedRoute><RoleRoute allowedRoles={["EMPLOYEE"]}><Orders /></RoleRoute></ProtectedRoute>} />
      <Route path="/employee/inventory" element={<ProtectedRoute><RoleRoute allowedRoles={["EMPLOYEE"]}><Inventory /></RoleRoute></ProtectedRoute>} />
      <Route path="/employee/profile" element={<ProtectedRoute><RoleRoute allowedRoles={["EMPLOYEE"]}><Profile /></RoleRoute></ProtectedRoute>} />
    </Routes>
  );
}

export default EmployeeRoutes;

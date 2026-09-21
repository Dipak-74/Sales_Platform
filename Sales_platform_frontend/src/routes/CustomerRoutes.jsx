import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleRoute from "../components/auth/RoleRoute";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import Products from "../pages/customer/Products";
import ProductDetails from "../pages/customer/ProductDetails";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import Orders from "../pages/customer/Orders";
import Profile from "../pages/customer/Profile";

function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/customer/dashboard" element={<ProtectedRoute><RoleRoute allowedRoles={["CUSTOMER"]}><CustomerDashboard /></RoleRoute></ProtectedRoute>} />
      <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
      <Route path="/customer/products" element={<ProtectedRoute><RoleRoute allowedRoles={["CUSTOMER"]}><Products /></RoleRoute></ProtectedRoute>} />
      <Route path="/customer/product/:id" element={<ProtectedRoute><RoleRoute allowedRoles={["CUSTOMER"]}><ProductDetails /></RoleRoute></ProtectedRoute>} />
      <Route path="/customer/cart" element={<ProtectedRoute><RoleRoute allowedRoles={["CUSTOMER"]}><Cart /></RoleRoute></ProtectedRoute>} />
      <Route path="/customer/checkout" element={<ProtectedRoute><RoleRoute allowedRoles={["CUSTOMER"]}><Checkout /></RoleRoute></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute><RoleRoute allowedRoles={["CUSTOMER"]}><Orders /></RoleRoute></ProtectedRoute>} />
      <Route path="/customer/profile" element={<ProtectedRoute><RoleRoute allowedRoles={["CUSTOMER"]}><Profile /></RoleRoute></ProtectedRoute>} />
    </Routes>
  );
}

export default CustomerRoutes;

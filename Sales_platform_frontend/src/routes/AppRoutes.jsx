import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// Auth & Common Pages
import Login from "../pages/auth/Login";
import GoogleRegister from "../pages/auth/GoogleRegister";
import Unauthorized from "../pages/auth/Unauthorized";
import NotFound from "../pages/common/NotFound";
import Profile from "../pages/common/Profile";
import Landing from "../pages/Landing";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminManagers from "../pages/admin/AdminManagers";
import AdminDepartments from "../pages/admin/AdminDepartments";
import AdminCategories from "../pages/admin/Categories";
import AdminProducts from "../pages/admin/Products";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminInvitations from "../pages/admin/AdminInvitations";
import AdminEmployees from "../pages/admin/Employees";
import AdminCustomers from "../pages/admin/Customers";
import AdminOrders from "../pages/admin/Orders";
import AdminInventory from "../pages/admin/Inventory";
import AdminAnalytics from "../pages/admin/Analytics";
import AdminPayments from "../pages/admin/Payments";

// Manager Pages
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerEmployees from "../pages/manager/ManagerEmployees";
import ManagerProducts from "../pages/manager/Products";
import ManagerCustomers from "../pages/manager/Customers";
import ManagerOrders from "../pages/manager/Orders";
import ManagerInventory from "../pages/manager/ManagerInventory";
import ManagerAnalytics from "../pages/manager/ManagerAnalytics";

// Employee Pages
import EmployeeDashboard from "../pages/employee/Dashboard";
import EmployeeCustomers from "../pages/employee/Customers";
import EmployeeOrders from "../pages/employee/Orders";
import EmployeeProducts from "../pages/employee/Products";
import EmployeeInventory from "../pages/employee/Inventory";

// Customer Pages
import CustomerDashboard from "../pages/customer/Dashboard";
import CustomerProducts from "../pages/customer/Products";
import CustomerProductDetails from "../pages/customer/ProductDetails";
import CustomerCart from "../pages/customer/Cart";
import CustomerCheckout from "../pages/customer/Checkout";
import CustomerPayment from "../pages/customer/Payment";
import CustomerOrders from "../pages/customer/Orders";
import CustomerProfile from "../pages/customer/Profile";

function RootRedirect() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const redirectMap = {
    ADMIN: "/admin/dashboard",
    MANAGER: "/manager/dashboard",
    EMPLOYEE: "/employee/dashboard",
    CUSTOMER: "/customer/dashboard",
  };

  return <Navigate to={redirectMap[role] || "/login"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<GoogleRegister />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Shared Common Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
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
      <Route
        path="/admin/managers"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminManagers />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminDepartments />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route path="/admin/categories" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><AdminCategories /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><AdminProducts /></RoleRoute></ProtectedRoute>} />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminUsers />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/invitations"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminInvitations />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route path="/admin/employees" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><AdminEmployees /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><AdminCustomers /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><AdminOrders /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/inventory" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><AdminInventory /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><AdminAnalytics /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN"]}><AdminPayments /></RoleRoute></ProtectedRoute>} />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Profile />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Manager Routes */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["MANAGER"]}>
              <ManagerDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/employees"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["MANAGER"]}>
              <ManagerEmployees />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/products"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["MANAGER"]}>
              <ManagerProducts />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/customers"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["MANAGER"]}>
              <ManagerCustomers />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/orders"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["MANAGER"]}>
              <ManagerOrders />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/inventory"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["MANAGER"]}>
              <ManagerInventory />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/analytics"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["MANAGER"]}>
              <ManagerAnalytics />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/profile"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["MANAGER"]}>
              <Profile />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/customers"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeCustomers />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/orders"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeOrders />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/products"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeProducts />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/inventory"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeInventory />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["EMPLOYEE"]}>
              <Profile />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Customer Routes */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/products"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["CUSTOMER"]}>
              <CustomerProducts />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/products/:id"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["CUSTOMER"]}>
              <CustomerProductDetails />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/cart"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["CUSTOMER"]}>
              <CustomerCart />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/checkout"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["CUSTOMER"]}>
              <CustomerCheckout />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/payment"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["CUSTOMER"]}>
              <CustomerPayment />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["CUSTOMER"]}>
              <CustomerOrders />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["CUSTOMER"]}>
              <CustomerProfile />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Root & Catch-all Fallbacks */}
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<RootRedirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;

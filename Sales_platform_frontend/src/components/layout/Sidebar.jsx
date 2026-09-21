import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuMap = {
  ADMIN: [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Managers", to: "/admin/managers" },
    { label: "Departments", to: "/admin/departments" },
    { label: "Employees", to: "/admin/employees" },
    { label: "Categories", to: "/admin/categories" },
    { label: "Products", to: "/admin/products" },
    { label: "Customers", to: "/admin/customers" },
    { label: "Orders", to: "/admin/orders" },
    { label: "Inventory", to: "/admin/inventory" },
    { label: "Payments", to: "/admin/payments" },
    { label: "Analytics", to: "/admin/analytics" },
    { label: "Users", to: "/admin/users" },
    { label: "Invitations", to: "/admin/invitations" },
    { label: "Profile", to: "/profile" },
  ],
  MANAGER: [
    { label: "Dashboard", to: "/manager/dashboard" },
    { label: "My Employees", to: "/manager/employees" },
    { label: "Products", to: "/manager/products" },
    { label: "Customers", to: "/manager/customers" },
    { label: "Orders", to: "/manager/orders" },
    { label: "Inventory", to: "/manager/inventory" },
    { label: "Analytics", to: "/manager/analytics" },
    { label: "Profile", to: "/profile" },
  ],
  EMPLOYEE: [
    { label: "Dashboard", to: "/employee/dashboard" },
    { label: "Customers", to: "/employee/customers" },
    { label: "Orders", to: "/employee/orders" },
    { label: "Products", to: "/employee/products" },
    { label: "Inventory", to: "/employee/inventory" },
    { label: "Profile", to: "/profile" },
  ],
  CUSTOMER: [
    { label: "Dashboard", to: "/customer/dashboard" },
    { label: "Products", to: "/customer/products" },
    { label: "Cart", to: "/customer/cart" },
    { label: "Checkout", to: "/customer/checkout" },
    { label: "My Orders", to: "/customer/orders" },
    { label: "Profile", to: "/customer/profile" },
  ],
};

function Sidebar({ onNavigate }) {
  const { role } = useAuth();
  const items = menuMap[role] || menuMap.CUSTOMER;

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-logo">S</div>
        <div>
          <strong>Smart Business</strong>
          <small>Management Suite</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map(({ label, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={onNavigate}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

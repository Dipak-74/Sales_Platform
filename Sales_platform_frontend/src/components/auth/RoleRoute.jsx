import { Navigate } from "react-router-dom";

function RoleRoute({ allowedRoles = [], children }) {
  const role = localStorage.getItem("role");

  if (!role || !allowedRoles.includes(role)) {
    const redirectMap = {
      ADMIN: "/admin/dashboard",
      MANAGER: "/manager/dashboard",
      EMPLOYEE: "/employee/dashboard",
      CUSTOMER: "/customer/dashboard",
    };

    return <Navigate to={redirectMap[role] || "/login"} replace />;
  }

  return children;
}

export default RoleRoute;

import { useEffect, useState } from "react";

import Login from "../pages/Login";
import Register from "../pages/Register";

import AdminDashboard from "../pages/AdminDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import CustomerDashboard from "../pages/CustomerDashboard";

function AuthWrapper() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [page]);

  const role = localStorage.getItem("role");

  if (!isLoggedIn) {
    return page === "login" ? (
      <Login setPage={setPage} setIsLoggedIn={setIsLoggedIn} />
    ) : (
      <Register setPage={setPage} setIsLoggedIn={setIsLoggedIn} />
    );
  }

  if (role === "ADMIN") return <AdminDashboard />;
  if (role === "MANAGER") return <ManagerDashboard />;
  if (role === "EMPLOYEE") return <EmployeeDashboard />;
  if (role === "CUSTOMER") return <CustomerDashboard />;

  localStorage.clear();
  return <Login setPage={setPage} setIsLoggedIn={setIsLoggedIn} />;
}

export default AuthWrapper;
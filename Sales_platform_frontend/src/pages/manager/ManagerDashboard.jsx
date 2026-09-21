import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getEmployeesByManager } from "../../services/employeeService";
import { getCustomers } from "../../services/customerService";
import { getOrders } from "../../services/orderService";
import { getLowStockProducts } from "../../services/inventoryService";

function ManagerDashboard() {
  const { userName, userId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    employees: 0,
    customers: 0,
    orders: 0,
    lowStock: 0,
  });
  const [teamEmployees, setTeamEmployees] = useState([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [empRes, custRes, ordRes, lowStockRes] = await Promise.allSettled([
        userId ? getEmployeesByManager(userId) : Promise.resolve({ data: [] }),
        getCustomers(),
        getOrders(),
        getLowStockProducts(),
      ]);

      const employeesList =
        empRes.status === "fulfilled" && Array.isArray(empRes.value?.data)
          ? empRes.value.data
          : [];

      const customersList =
        custRes.status === "fulfilled" && Array.isArray(custRes.value?.data)
          ? custRes.value.data
          : [];

      const ordersList =
        ordRes.status === "fulfilled" && Array.isArray(ordRes.value?.data)
          ? ordRes.value.data
          : [];

      const lowStockList =
        lowStockRes.status === "fulfilled" && Array.isArray(lowStockRes.value?.data)
          ? lowStockRes.value.data
          : [];

      setStats({
        employees: employeesList.length,
        customers: customersList.length,
        orders: ordersList.length,
        lowStock: lowStockList.length,
      });

      setTeamEmployees(employeesList.slice(0, 5));
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load manager dashboard metrics."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <MainLayout
      title="Manager Dashboard"
      breadcrumb={["Dashboard"]}
      userName={userName || "Manager"}
    >
      <div style={{ display: "grid", gap: 24 }}>
        {loading && <Loader text="Loading team workspace..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && (
          <>
            <div className="stats-grid">
              <StatCard
                label="Team Employees"
                value={stats.employees}
                helper="Under your management"
              />
              <StatCard
                label="Registered Customers"
                value={stats.customers}
                helper="Customer directory"
              />
              <StatCard
                label="Total Orders"
                value={stats.orders}
                helper="All store orders"
              />
              <StatCard
                label="Low Stock Alerts"
                value={stats.lowStock}
                helper="Needs restocking"
              />
            </div>

            <div className="panel-card">
              <h3 style={{ margin: "0 0 14px 0" }}>Team Operations</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/manager/employees" className="primary-btn">
                  Manage Employees
                </Link>
                <Link to="/manager/products" className="secondary-btn">
                  Manage Products
                </Link>
                <Link to="/manager/customers" className="secondary-btn">
                  Manage Customers
                </Link>
                <Link to="/manager/orders" className="secondary-btn">
                  Manage Orders
                </Link>
                <Link to="/manager/inventory" className="secondary-btn">
                  Manage Inventory
                </Link>
                <Link to="/manager/analytics" className="secondary-btn">
                  View Analytics
                </Link>
              </div>
            </div>

            <div className="panel-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <h3 style={{ margin: 0 }}>My Team Members</h3>
                <Link to="/manager/employees" style={{ fontSize: "0.88rem" }}>
                  View All Employees &rarr;
                </Link>
              </div>

              {teamEmployees.length === 0 ? (
                <div className="empty-state">
                  No employees in your team yet. Add employees from the team directory.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Emp Code</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Designation</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamEmployees.map((emp) => {
                        const id = emp.employeeId ?? emp.id;
                        return (
                          <tr key={id}>
                            <td>
                              <code>{emp.employeeCode || `#${id}`}</code>
                            </td>
                            <td>
                              <strong>{emp.name || "-"}</strong>
                            </td>
                            <td>{emp.email || "-"}</td>
                            <td>{emp.designation || "-"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  emp.status === "ACTIVE"
                                    ? "badge-success"
                                    : "badge-danger"
                                }`}
                              >
                                {emp.status || "ACTIVE"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default ManagerDashboard;


import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getManagers } from "../../services/managerService";
import { getAllAdminDepartments } from "../../services/departmentService";
import { getUsersByRole, getUsersByStatus } from "../../services/userService";

function AdminDashboard() {
  const { userName } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    managers: 0,
    departments: 0,
    activeUsers: 0,
    employees: 0,
  });
  const [recentManagers, setRecentManagers] = useState([]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [managersRes, deptsRes, activeUsersRes, employeesRes] =
        await Promise.allSettled([
          getManagers(),
          getAllAdminDepartments(),
          getUsersByStatus("ACTIVE"),
          getUsersByRole("EMPLOYEE"),
        ]);

      const managersList =
        managersRes.status === "fulfilled" && Array.isArray(managersRes.value?.data)
          ? managersRes.value.data
          : [];

      const deptsList =
        deptsRes.status === "fulfilled" && Array.isArray(deptsRes.value?.data)
          ? deptsRes.value.data
          : [];

      const activeUsersList =
        activeUsersRes.status === "fulfilled" && Array.isArray(activeUsersRes.value?.data)
          ? activeUsersRes.value.data
          : [];

      const employeesList =
        employeesRes.status === "fulfilled" && Array.isArray(employeesRes.value?.data)
          ? employeesRes.value.data
          : [];

      setStats({
        managers: managersList.length,
        departments: deptsList.length,
        activeUsers: activeUsersList.length,
        employees: employeesList.length,
      });

      setRecentManagers(managersList.slice(0, 5));
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load dashboard metrics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <MainLayout
      title="Admin Control Center"
      breadcrumb={["Dashboard"]}
      userName={userName || "Admin"}
    >
      <div style={{ display: "grid", gap: 24 }}>
        {loading && <Loader text="Loading administrative overview..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && (
          <>
            {/* Stat Cards */}
            <div className="stats-grid">
              <StatCard
                label="Total Managers"
                value={stats.managers}
                helper="Department Leads"
              />
              <StatCard
                label="Departments"
                value={stats.departments}
                helper="Active business units"
              />
              <StatCard
                label="Total Active Users"
                value={stats.activeUsers}
                helper="Across all roles"
              />
              <StatCard
                label="System Employees"
                value={stats.employees}
                helper="Managed by team leads"
              />
            </div>

            {/* Quick Actions Panel */}
            <div className="panel-card">
              <h3 style={{ margin: "0 0 14px 0" }}>Quick Management</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/admin/managers" className="primary-btn">
                  Manage Managers
                </Link>
                <Link to="/admin/departments" className="secondary-btn">
                  Manage Departments
                </Link>
                <Link to="/admin/categories" className="secondary-btn">
                  Manage Categories
                </Link>
                <Link to="/admin/products" className="secondary-btn">
                  Manage Products
                </Link>
                <Link to="/admin/users" className="secondary-btn">
                  View All Users
                </Link>
                <Link to="/admin/invitations" className="secondary-btn">
                  Employee Invitations
                </Link>
              </div>
            </div>

            {/* Recent Managers Overview */}
            <div className="panel-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <h3 style={{ margin: 0 }}>Recent Managers</h3>
                <Link to="/admin/managers" style={{ fontSize: "0.88rem" }}>
                  View All Managers &rarr;
                </Link>
              </div>

              {recentManagers.length === 0 ? (
                <div className="empty-state">No managers registered yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentManagers.map((m) => (
                        <tr key={m.userId}>
                          <td>#{m.userId}</td>
                          <td>
                            <strong>{m.name || "-"}</strong>
                          </td>
                          <td>{m.email || "-"}</td>
                          <td>
                            <span
                              className={`badge ${
                                m.status === "ACTIVE"
                                  ? "badge-success"
                                  : "badge-danger"
                              }`}
                            >
                              {m.status || "ACTIVE"}
                            </span>
                          </td>
                        </tr>
                      ))}
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

export default AdminDashboard;


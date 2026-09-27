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
import { getProducts } from "../../services/productService";
import { getOrders } from "../../services/orderService";
import { formatCurrency, formatDate } from "../../utils/formatters";

function AdminDashboard() {
  const { userName } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    managers: 0,
    departments: 0,
    activeUsers: 0,
    employees: 0,
    totalProducts: 0,
    lowStock: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [recentManagers, setRecentManagers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [managersRes, deptsRes, activeUsersRes, employeesRes, productsRes, ordersRes] =
        await Promise.allSettled([
          getManagers(),
          getAllAdminDepartments(),
          getUsersByStatus("ACTIVE"),
          getUsersByRole("EMPLOYEE"),
          getProducts(),
          getOrders(),
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

      const productsList =
        productsRes.status === "fulfilled" && Array.isArray(productsRes.value?.data)
          ? productsRes.value.data
          : [];

      const ordersList =
        ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value?.data)
          ? ordersRes.value.data
          : [];

      const lowStockCount = productsList.filter(
        (p) => Number(p.quantity ?? p.stockQuantity ?? 100) <= 10
      ).length;

      const revenue = ordersList.reduce(
        (sum, o) => sum + Number(o.totalAmount || o.total || o.amount || 0),
        0
      );

      setStats({
        managers: managersList.length,
        departments: deptsList.length,
        activeUsers: activeUsersList.length,
        employees: employeesList.length,
        totalProducts: productsList.length,
        lowStock: lowStockCount,
        totalOrders: ordersList.length,
        totalRevenue: revenue,
      });

      setRecentManagers(managersList.slice(0, 5));
      setRecentOrders(ordersList.slice(0, 5));
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

  const getStatusBadge = (status) => {
    switch ((status || "").toUpperCase()) {
      case "DELIVERED":
      case "COMPLETED":
      case "PAID":
      case "ACTIVE":
        return "badge-success";
      case "PROCESSING":
      case "SHIPPED":
      case "CONFIRMED":
        return "badge-info";
      case "CANCELLED":
      case "FAILED":
      case "INACTIVE":
        return "badge-danger";
      case "PENDING":
      default:
        return "badge-warning";
    }
  };

  return (
    <MainLayout
      title="Admin Control Center"
      breadcrumb={["Workspace", "Executive Overview"]}
      userName={userName || "Admin"}
    >
      <div style={{ display: "grid", gap: 24 }}>
        {loading && <Loader text="Loading administrative overview..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && (
          <>
            {/* KPI Cards Grid */}
            <div className="stats-grid">
              <StatCard
                label="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                helper="All recorded client orders"
                trend="+14.2% MoM"
                variant="blue"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                }
              />
              <StatCard
                label="Orders Fulfilled"
                value={stats.totalOrders}
                helper="Processing & completed orders"
                trend="+8.5%"
                variant="purple"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                }
              />
              <StatCard
                label="Catalog Products"
                value={stats.totalProducts}
                helper={stats.lowStock > 0 ? `${stats.lowStock} low-stock items` : "Stock levels optimal"}
                variant={stats.lowStock > 0 ? "amber" : "green"}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="m7.5 4.27 9 5.15" />
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                }
              />
              <StatCard
                label="Team & Leads"
                value={stats.managers + stats.employees}
                helper={`${stats.managers} managers · ${stats.employees} staff`}
                variant="blue"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
              />
            </div>

            {/* Quick Management Suite Bar */}
            <div className="panel-card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>Quick Operations</h3>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Shortcuts to platform administration</span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link to="/admin/analytics" className="primary-btn" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  <span>Business Analytics</span>
                </Link>
                <Link to="/admin/departments" className="secondary-btn" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  Departments
                </Link>
                <Link to="/admin/categories" className="secondary-btn" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  Categories
                </Link>
                <Link to="/admin/products" className="secondary-btn" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  Manage Products
                </Link>
                <Link to="/admin/orders" className="secondary-btn" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  Order Pipeline
                </Link>
                <Link to="/admin/inventory" className="secondary-btn" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  Inventory Stock
                </Link>
                <Link to="/admin/users" className="secondary-btn" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  Users
                </Link>
                <Link to="/admin/managers" className="secondary-btn" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  Managers
                </Link>
                <Link to="/admin/reports" className="secondary-btn" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                  Export Reports
                </Link>
              </div>
            </div>

            {/* Two Column Grid: Recent Orders & Recent Managers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: 24 }}>
              {/* Recent Orders Panel */}
              <div className="panel-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Recent Customer Orders</h3>
                    <small style={{ color: "var(--text-muted)" }}>Live fulfillment stream</small>
                  </div>
                  <Link to="/admin/orders" style={{ fontSize: "0.84rem", fontWeight: 600 }}>
                    View all orders &rarr;
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="empty-state">No orders registered yet.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((o) => {
                          const id = o.id ?? o.orderId;
                          const cust = o.customer?.name || o.customerName || `Customer #${o.customerId || id}`;
                          const total = o.totalAmount ?? o.total ?? o.amount ?? 0;
                          return (
                            <tr key={id}>
                              <td>
                                <strong>#{id}</strong>
                                <small style={{ display: "block", color: "var(--text-light)", fontSize: "0.72rem" }}>
                                  {formatDate(o.orderDate || o.createdAt)}
                                </small>
                              </td>
                              <td style={{ fontWeight: 600 }}>{cust}</td>
                              <td>
                                <strong>{formatCurrency(total)}</strong>
                              </td>
                              <td>
                                <span className={`badge ${getStatusBadge(o.status)}`}>
                                  {o.status || "PENDING"}
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

              {/* Recent Managers Overview */}
              <div className="panel-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Department Leads</h3>
                    <small style={{ color: "var(--text-muted)" }}>Active management personnel</small>
                  </div>
                  <Link to="/admin/managers" style={{ fontSize: "0.84rem", fontWeight: 600 }}>
                    View all leads &rarr;
                  </Link>
                </div>

                {recentManagers.length === 0 ? (
                  <div className="empty-state">No managers registered yet.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Manager</th>
                          <th>Email</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentManagers.map((m) => (
                          <tr key={m.userId}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: "#eff6ff",
                                    color: "#2563eb",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  {String(m.name || "M").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <strong>{m.name || "Manager"}</strong>
                                  <small style={{ display: "block", color: "var(--text-light)", fontSize: "0.72rem" }}>
                                    ID #{m.userId}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                              {m.email || "-"}
                            </td>
                            <td>
                              <span className={`badge ${m.status === "ACTIVE" ? "badge-success" : "badge-danger"}`}>
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
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default AdminDashboard;

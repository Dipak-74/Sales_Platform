import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import { ChartCard, SimpleBarChart, SimpleLineChart } from "../../components/dashboard/Charts";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getDashboardAnalytics, getSalesAnalytics } from "../../services/analyticsService";
import { getManagers } from "../../services/managerService";
import { getUsersByRole } from "../../services/userService";
import { getCustomers } from "../../services/customerService";
import { getProducts } from "../../services/productService";
import { getOrders } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";

function AdminDashboard() {
  const { userName } = useAuth();
  const [stats, setStats] = useState({
    managersCount: 0,
    employeesCount: 0,
    customersCount: 0,
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
  });
  const [salesTrend, setSalesTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Attempt to fetch dashboard analytics
        try {
          const analyticsRes = await getDashboardAnalytics();
          const data = analyticsRes?.data || {};
          if (!ignore && Object.keys(data).length > 0) {
            setStats({
              managersCount: data.totalManagers ?? 0,
              employeesCount: data.totalEmployees ?? 0,
              customersCount: data.totalCustomers ?? 0,
              productsCount: data.totalProducts ?? 0,
              ordersCount: data.totalOrders ?? 0,
              totalRevenue: data.totalRevenue ?? 0,
            });
          }
        } catch {
          // If dedicated analytics endpoint fails, fetch counts directly from entity APIs
          const [mgrRes, empRes, custRes, prodRes, ordRes] = await Promise.allSettled([
            getManagers(),
            getUsersByRole("EMPLOYEE"),
            getCustomers(),
            getProducts(),
            getOrders(),
          ]);

          if (!ignore) {
            const managers = mgrRes.status === "fulfilled" && Array.isArray(mgrRes.value?.data) ? mgrRes.value.data.length : 0;
            const employees = empRes.status === "fulfilled" && Array.isArray(empRes.value?.data) ? empRes.value.data.length : 0;
            const customers = custRes.status === "fulfilled" && Array.isArray(custRes.value?.data) ? custRes.value.data.length : 0;
            const products = prodRes.status === "fulfilled" && Array.isArray(prodRes.value?.data) ? prodRes.value.data.length : 0;
            const orders = ordRes.status === "fulfilled" && Array.isArray(ordRes.value?.data) ? ordRes.value.data : [];
            const revenue = orders.reduce((sum, ord) => sum + (ord.totalAmount ?? ord.total ?? ord.amount ?? 0), 0);

            setStats({
              managersCount: managers,
              employeesCount: employees,
              customersCount: customers,
              productsCount: products,
              ordersCount: orders.length,
              totalRevenue: revenue,
            });
          }
        }

        // Fetch sales trend for charts
        try {
          const trendRes = await getSalesAnalytics();
          if (!ignore && Array.isArray(trendRes?.data)) {
            setSalesTrend(trendRes.data);
          }
        } catch {
          // Trend endpoint optional if empty
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.response?.data?.message || "Failed to load dashboard metrics.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <MainLayout title="Admin Dashboard" breadcrumb={["Dashboard"]} userName={userName || "Admin"}>
      {loading && <Loader text="Loading dashboard data..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && (
        <div style={{ display: "grid", gap: 24 }}>
          <div className="stats-grid">
            <StatCard label="Total Managers" value={stats.managersCount} helper="Management team" />
            <StatCard label="Total Employees" value={stats.employeesCount} helper="Staff records" />
            <StatCard label="Total Customers" value={stats.customersCount} helper="Registered clients" />
            <StatCard label="Products" value={stats.productsCount} helper="Catalog items" />
            <StatCard label="Total Orders" value={stats.ordersCount} helper="Processed orders" />
            <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} helper="Gross sales" />
          </div>

          {salesTrend.length > 0 && (
            <div className="card-grid">
              <ChartCard title="Sales Trend">
                <SimpleLineChart data={salesTrend} dataKey="sales" labelKey="date" />
              </ChartCard>
              <ChartCard title="Revenue Distribution">
                <SimpleBarChart data={salesTrend} dataKey="revenue" labelKey="date" />
              </ChartCard>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
}

export default AdminDashboard;

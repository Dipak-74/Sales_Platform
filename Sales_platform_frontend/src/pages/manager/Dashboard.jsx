import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import { ChartCard, SimpleBarChart, SimpleLineChart } from "../../components/dashboard/Charts";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getEmployees } from "../../services/employeeService";
import { getProducts } from "../../services/productService";
import { getCustomers } from "../../services/customerService";
import { getOrders } from "../../services/orderService";
import { getInventory } from "../../services/inventoryService";
import { getSalesAnalytics } from "../../services/analyticsService";
import { formatCurrency } from "../../utils/formatCurrency";

function ManagerDashboard() {
  const { userName, userId } = useAuth();
  const [stats, setStats] = useState({
    employees: 0,
    products: 0,
    customers: 0,
    orders: 0,
    lowStock: 0,
    revenue: 0,
  });
  const [salesTrend, setSalesTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadManagerStats = async () => {
      try {
        setLoading(true);
        setError("");

        const [empRes, prodRes, custRes, ordRes, invRes, trendRes] = await Promise.allSettled([
          userId ? getEmployees(userId) : Promise.resolve({ data: [] }),
          getProducts(),
          getCustomers(),
          getOrders(),
          getInventory(),
          getSalesAnalytics(),
        ]);

        if (!ignore) {
          const employeesCount = empRes.status === "fulfilled" && Array.isArray(empRes.value?.data) ? empRes.value.data.length : 0;
          const productsCount = prodRes.status === "fulfilled" && Array.isArray(prodRes.value?.data) ? prodRes.value.data.length : 0;
          const customersCount = custRes.status === "fulfilled" && Array.isArray(custRes.value?.data) ? custRes.value.data.length : 0;
          const ordersList = ordRes.status === "fulfilled" && Array.isArray(ordRes.value?.data) ? ordRes.value.data : [];
          const inventoryList = invRes.status === "fulfilled" && Array.isArray(invRes.value?.data) ? invRes.value.data : [];

          const lowStockCount = inventoryList.filter((i) => (i.quantity ?? 0) <= (i.minimumStock ?? i.minStock ?? 5)).length;
          const totalRev = ordersList.reduce((sum, o) => sum + (o.totalAmount ?? o.total ?? o.amount ?? 0), 0);

          setStats({
            employees: employeesCount,
            products: productsCount,
            customers: customersCount,
            orders: ordersList.length,
            lowStock: lowStockCount,
            revenue: totalRev,
          });

          if (trendRes.status === "fulfilled" && Array.isArray(trendRes.value?.data)) {
            setSalesTrend(trendRes.value.data);
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.response?.data?.message || "Failed to load manager dashboard.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadManagerStats();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <MainLayout title="Manager Dashboard" breadcrumb={["Dashboard"]} userName={userName || "Manager"}>
      {loading && <Loader text="Loading metrics..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && (
        <div style={{ display: "grid", gap: 24 }}>
          <div className="stats-grid">
            <StatCard label="Team Members" value={stats.employees} helper="Managed workforce" />
            <StatCard label="Catalog Products" value={stats.products} helper="Available items" />
            <StatCard label="Customer Base" value={stats.customers} helper="Active clients" />
            <StatCard label="Total Orders" value={stats.orders} helper="Order fulfillment" />
            <StatCard label="Low Stock Items" value={stats.lowStock} helper="Requires restocking" />
            <StatCard label="Manager Revenue" value={formatCurrency(stats.revenue)} helper="Gross volume" />
          </div>

          {salesTrend.length > 0 && (
            <div className="card-grid">
              <ChartCard title="Sales Activity">
                <SimpleLineChart data={salesTrend} dataKey="sales" labelKey="date" />
              </ChartCard>
              <ChartCard title="Revenue Flow">
                <SimpleBarChart data={salesTrend} dataKey="revenue" labelKey="date" />
              </ChartCard>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
}

export default ManagerDashboard;

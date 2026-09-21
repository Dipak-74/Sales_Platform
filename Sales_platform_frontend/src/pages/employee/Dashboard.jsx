import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getOrders } from "../../services/orderService";
import { getProducts } from "../../services/productService";
import { getCustomers } from "../../services/customerService";
import { getInventory } from "../../services/inventoryService";

function EmployeeDashboard() {
  const { userName } = useAuth();
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    products: 0,
    lowStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [custRes, ordRes, prodRes, invRes] = await Promise.allSettled([
          getCustomers(),
          getOrders(),
          getProducts(),
          getInventory(),
        ]);

        if (!ignore) {
          const customersCount = custRes.status === "fulfilled" && Array.isArray(custRes.value?.data) ? custRes.value.data.length : 0;
          const ordersList = ordRes.status === "fulfilled" && Array.isArray(ordRes.value?.data) ? ordRes.value.data : [];
          const productsCount = prodRes.status === "fulfilled" && Array.isArray(prodRes.value?.data) ? prodRes.value.data.length : 0;
          const inventoryList = invRes.status === "fulfilled" && Array.isArray(invRes.value?.data) ? invRes.value.data : [];

          const lowStockCount = inventoryList.filter((i) => (i.quantity ?? 0) <= (i.minimumStock ?? i.minStock ?? 5)).length;

          setStats({
            customers: customersCount,
            orders: ordersList.length,
            products: productsCount,
            lowStock: lowStockCount,
          });
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.response?.data?.message || "Failed to load operational stats.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <MainLayout title="Employee Dashboard" breadcrumb={["Dashboard"]} userName={userName || "Employee"}>
      {loading && <Loader text="Loading workspace..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && (
        <div style={{ display: "grid", gap: 24 }}>
          <div className="stats-grid">
            <StatCard label="Customer Contacts" value={stats.customers} helper="Directory access" />
            <StatCard label="Work Queue Orders" value={stats.orders} helper="Current active orders" />
            <StatCard label="Catalog Products" value={stats.products} helper="Available stock items" />
            <StatCard label="Low Stock Alerts" value={stats.lowStock} helper="Requires review" />
          </div>

          <div className="panel-card">
            <h3>Operational Guidelines</h3>
            <p style={{ color: "var(--text-secondary)", margin: "8px 0" }}>
              Welcome to the Employee operations portal. Use the navigation sidebar to review customer orders, confirm fulfillment, check warehouse inventory levels, and inspect the product catalog.
            </p>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default EmployeeDashboard;

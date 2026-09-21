import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import OrderTable from "../../components/order/OrderTable";
import Loader from "../../components/common/Loader";
import { getCustomerOrders } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";

function CustomerDashboard() {
  const { userName, userId } = useAuth();
  const { count, subtotal } = useCart();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    if (!userId) return;

    const loadOrders = async () => {
      try {
        setLoading(true);
        const res = await getCustomerOrders(userId);
        if (!ignore && Array.isArray(res?.data)) {
          setRecentOrders(res.data.slice(0, 5));
        }
      } catch {
        // optional
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadOrders();
    return () => {
      ignore = true;
    };
  }, [userId]);

  return (
    <MainLayout title="Customer Portal" breadcrumb={["Dashboard"]} userName={userName || "Customer"}>
      <div style={{ display: "grid", gap: 24 }}>
        <div className="stats-grid">
          <StatCard label="Welcome" value={userName || "Customer"} helper="Client account" />
          <StatCard label="Items in Cart" value={count} helper="Pending checkout" />
          <StatCard label="Cart Value" value={formatCurrency(subtotal)} helper="Current subtotal" />
          <StatCard label="Total Orders Placed" value={recentOrders.length} helper="Lifetime orders" />
        </div>

        <div className="panel-card" style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <h3 style={{ margin: 0 }}>Quick Actions</h3>
              <small style={{ color: "var(--text-muted)" }}>Jump straight to shopping or cart checkout</small>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link to="/customer/products" className="primary-btn">
                Browse Products
              </Link>
              <Link to="/customer/cart" className="secondary-btn">
                View Cart ({count})
              </Link>
            </div>
          </div>
        </div>

        <div className="panel-card" style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Recent Orders</h3>
            <Link to="/customer/orders" className="nav-link">
              View All Orders &rarr;
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading recent orders..." />
          ) : !recentOrders.length ? (
            <div className="empty-state">
              You haven&apos;t placed any orders yet. <Link to="/customer/products">Start shopping now!</Link>
            </div>
          ) : (
            <OrderTable orders={recentOrders} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default CustomerDashboard;

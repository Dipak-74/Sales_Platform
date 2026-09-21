import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import OrderTable from "../../components/order/OrderTable";
import OrderDetails from "../../components/order/OrderDetails";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { getCustomerOrders } from "../../services/orderService";
import { getCustomerProfile } from "../../services/customerService";

function CustomerOrders() {
  const { userName, userId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeOrder, setActiveOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      let cId = userId;
      try {
        const profRes = await getCustomerProfile(userId);
        if (profRes?.data?.customerId) {
          cId = profRes.data.customerId;
        }
      } catch {
        // Fall back to userId
      }

      const res = await getCustomerOrders(cId);
      setOrders(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <MainLayout title="My Orders" breadcrumb={["Dashboard", "Orders"]} userName={userName || "Customer"}>
      <div className="panel-card" style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0 }}>Order History</h3>
            <small style={{ color: "var(--text-muted)" }}>Track package delivery status and receipts</small>
          </div>
          <Link to="/customer/products" className="primary-btn">
            Shop More
          </Link>
        </div>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading order history..." />
        ) : !orders.length ? (
          <div className="empty-state">
            You have not placed any orders yet. <Link to="/customer/products">Explore products to order!</Link>
          </div>
        ) : (
          <OrderTable
            orders={orders}
            onViewDetails={(order) => {
              setActiveOrder(order);
              setIsDetailsOpen(true);
            }}
          />
        )}
      </div>

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setActiveOrder(null);
        }}
        title="Order Summary & Receipt"
        maxWidth="680px"
      >
        <OrderDetails
          order={activeOrder}
          onClose={() => setIsDetailsOpen(false)}
        />
      </Modal>
    </MainLayout>
  );
}

export default CustomerOrders;

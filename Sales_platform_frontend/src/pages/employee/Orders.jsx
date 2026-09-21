import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import OrderTable from "../../components/order/OrderTable";
import OrderDetails from "../../components/order/OrderDetails";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getOrders, updateOrderStatus } from "../../services/orderService";

function EmployeeOrders() {
  const { userName } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getOrders();
      setOrders(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      setSuccessMsg(`Order #${id} updated to ${newStatus}.`);
      if (activeOrder && (activeOrder.id === id || activeOrder.orderId === id)) {
        setActiveOrder((prev) => ({ ...prev, status: newStatus }));
      }
      setTimeout(() => setSuccessMsg(""), 3000);
      loadOrders();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update order status.");
    }
  };

  const displayedOrders = selectedStatus
    ? orders.filter((o) => (o.status || "").toUpperCase() === selectedStatus.toUpperCase())
    : orders;

  return (
    <MainLayout title="Orders Queue" breadcrumb={["Dashboard", "Orders"]} userName={userName || "Employee"}>
      <div className="panel-card" style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h3 style={{ margin: 0 }}>Work Queue & Order Dispatch</h3>
            <small style={{ color: "var(--text-muted)" }}>Fulfill orders, process packing, and dispatch to courier</small>
          </div>

          <select
            className="select"
            style={{ maxWidth: 200 }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading orders..." />
        ) : (
          <OrderTable
            orders={displayedOrders}
            onViewDetails={(order) => {
              setActiveOrder(order);
              setIsDetailsOpen(true);
            }}
            onUpdateStatus={handleUpdateStatus}
            canUpdateStatus={true}
          />
        )}
      </div>

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setActiveOrder(null);
        }}
        title="Order Details"
        maxWidth="720px"
      >
        <OrderDetails
          order={activeOrder}
          onClose={() => setIsDetailsOpen(false)}
          onUpdateStatus={handleUpdateStatus}
          canUpdateStatus={true}
        />
      </Modal>
    </MainLayout>
  );
}

export default EmployeeOrders;

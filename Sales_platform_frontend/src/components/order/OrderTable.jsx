import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function getStatusBadgeClass(status) {
  switch ((status || "").toUpperCase()) {
    case "DELIVERED":
    case "COMPLETED":
    case "PAID":
      return "badge-success";
    case "PROCESSING":
    case "CONFIRMED":
    case "SHIPPED":
      return "badge-info";
    case "CANCELLED":
    case "FAILED":
      return "badge-danger";
    case "PENDING":
    default:
      return "badge-warning";
  }
}

function OrderTable({ orders = [], onViewDetails, onUpdateStatus, canUpdateStatus = false }) {
  if (!orders.length) {
    return <div className="empty-state">No orders found.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const id = order.id ?? order.orderId;
            const itemsCount = Array.isArray(order.items) ? order.items.length : (order.itemsCount || 1);
            const totalAmount = order.totalAmount ?? order.total ?? order.amount ?? 0;
            const customerName = order.customer?.name || order.customerName || `Customer #${order.customerId || "-"}`;

            return (
              <tr key={id}>
                <td>
                  <strong>#{id}</strong>
                </td>
                <td>{formatDate(order.orderDate || order.createdAt)}</td>
                <td>{customerName}</td>
                <td>{itemsCount} item{itemsCount > 1 ? "s" : ""}</td>
                <td>
                  <strong>{formatCurrency(totalAmount)}</strong>
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status || "PENDING"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    {onViewDetails && (
                      <button
                        type="button"
                        className="secondary-btn"
                        style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                        onClick={() => onViewDetails(order)}
                      >
                        View
                      </button>
                    )}
                    {canUpdateStatus && onUpdateStatus && (
                      <select
                        className="select"
                        style={{ padding: "4px 8px", fontSize: "0.82rem", width: "auto" }}
                        value={order.status || "PENDING"}
                        onChange={(e) => onUpdateStatus(id, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;


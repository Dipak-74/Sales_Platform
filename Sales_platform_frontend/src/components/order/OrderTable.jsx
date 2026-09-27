
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function getStatusBadgeClass(status) {
  switch ((status || "").toUpperCase()) {
    case "DELIVERED":
    case "COMPLETED":
    case "PAID":
      return "badge-success";

    case "CONFIRMED":
    case "PROCESSING":
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

function OrderTable({
  orders = [],
  onViewDetails,
  onUpdateStatus,
  canUpdateStatus = false,
}) {
  if (!orders.length) {
    return (
      <div className="empty-state">
        No orders found.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date Placed</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total Amount</th>
            <th>Fulfillment Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const id = order.id ?? order.orderId;

            const itemsCount = Array.isArray(order.items)
              ? order.items.length
              : Number(order.itemsCount || 0);

            const totalAmount =
              order.totalAmount ??
              order.total ??
              order.amount ??
              0;

            const customerName =
              order.customer?.name ||
              order.customerName ||
              `Customer #${order.customerId || "-"}`;

            const customerEmail =
              order.customer?.email ||
              order.customerEmail ||
              "";

            const status = order.status || "PENDING";

            return (
              <tr key={id}>
                {/* Order ID */}
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      color: "#1e293b",
                      background: "#f1f5f9",
                      padding: "3px 8px",
                      borderRadius: 6,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    #{id}
                  </span>
                </td>

                {/* Date */}
                <td
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatDate(order.orderDate || order.createdAt)}
                </td>

                {/* Customer */}
                <td>
                  <strong
                    style={{
                      display: "block",
                      color: "var(--text-main)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {customerName}
                  </strong>

                  {customerEmail && (
                    <small
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.76rem",
                      }}
                    >
                      {customerEmail}
                    </small>
                  )}
                </td>

                {/* Items */}
                <td>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {itemsCount}{" "}
                    {itemsCount === 1 ? "item" : "items"}
                  </span>
                </td>

                {/* Total */}
                <td>
                  <strong
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--text-main)",
                    }}
                  >
                    {formatCurrency(totalAmount)}
                  </strong>
                </td>

                {/* Status */}
                <td>
                  <span
                    className={`badge ${getStatusBadgeClass(status)}`}
                  >
                    {status}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ textAlign: "right" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    {onViewDetails && (
                      <button
                        type="button"
                        className="secondary-btn"
                        style={{
                          padding: "6px 12px",
                          fontSize: "0.82rem",
                        }}
                        onClick={() => onViewDetails(order)}
                      >
                        View Details
                      </button>
                    )}

                    {canUpdateStatus && onUpdateStatus && (
                      <select
                        className="select"
                        style={{
                          padding: "4px 8px",
                          fontSize: "0.8rem",
                          width: "auto",
                        }}
                        value={status}
                        onChange={(e) =>
                          onUpdateStatus(id, e.target.value)
                        }
                        aria-label="Update order status"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
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

import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function OrderDetails({ order, onClose, onUpdateStatus, canUpdateStatus = false }) {
  if (!order) return null;

  const id = order.id ?? order.orderId;
  const items = Array.isArray(order.items) ? order.items : [];
  const totalAmount = order.totalAmount ?? order.total ?? order.amount ?? 0;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "1.2rem" }}>Order #{id}</h4>
          <small style={{ color: "var(--text-muted)" }}>Placed on {formatDate(order.orderDate || order.createdAt)}</small>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="badge badge-info">{order.status || "PENDING"}</span>
          {canUpdateStatus && onUpdateStatus && (
            <select
              className="select"
              style={{ padding: "6px 10px", fontSize: "0.85rem", width: "auto" }}
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
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <div className="panel-card" style={{ padding: 14 }}>
          <small style={{ color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Customer</small>
          <strong>{order.customer?.name || order.customerName || `ID: ${order.customerId || "-"}`}</strong>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            {order.customer?.email || order.customerEmail || ""}
          </div>
        </div>

        <div className="panel-card" style={{ padding: 14 }}>
          <small style={{ color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Shipping Address</small>
          <div style={{ fontSize: "0.88rem", lineHeight: 1.4 }}>
            {order.address || order.shippingAddress || "Not provided"}
          </div>
        </div>

        <div className="panel-card" style={{ padding: 14 }}>
          <small style={{ color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Payment</small>
          <strong>{order.paymentMethod || "CARD"}</strong>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Status: {order.paymentStatus || (order.status === "DELIVERED" ? "PAID" : "PENDING")}
          </div>
        </div>
      </div>

      <div>
        <h5 style={{ margin: "0 0 10px", fontSize: "1rem" }}>Order Items</h5>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, idx) => {
                  const unitPrice = item.price ?? item.sellingPrice ?? 0;
                  const qty = item.quantity ?? 1;
                  return (
                    <tr key={item.id ?? idx}>
                      <td>
                        <strong>{item.productName || item.product?.name || item.name || `Item #${item.productId || idx + 1}`}</strong>
                      </td>
                      <td>{formatCurrency(unitPrice)}</td>
                      <td>x {qty}</td>
                      <td style={{ textAlign: "right" }}>{formatCurrency(unitPrice * qty)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "var(--text-muted)" }}>
                    Order item details not specified in summary.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ textAlign: "right", fontWeight: 700 }}>Grand Total:</td>
                <td style={{ textAlign: "right", fontWeight: 800, fontSize: "1.1rem", color: "var(--primary)" }}>
                  {formatCurrency(totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {onClose && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" className="secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;


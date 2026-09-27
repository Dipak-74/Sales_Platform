import { formatCurrency } from "../../utils/formatters";

function ProductTable({ products = [], onEdit, onToggleStatus, userRole = "ADMIN" }) {
  const canEdit = ["ADMIN", "MANAGER", "EMPLOYEE"].includes(userRole);

  if (!products.length) {
    return <div className="empty-state">No products found in catalog.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 64 }}>Preview</th>
            <th>SKU</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Selling Price</th>
            <th>Status</th>
            {canEdit && <th style={{ textAlign: "right", width: 180 }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const id = product.id ?? product.productId;
            const isInactive = product.status === "INACTIVE";

            return (
              <tr key={id}>
                <td>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    }}
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: "monospace",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      background: "#f1f5f9",
                      padding: "3px 8px",
                      borderRadius: 6,
                      color: "#475569",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {product.sku || `SKU-${id}`}
                  </span>
                </td>
                <td>
                  <strong style={{ display: "block", color: "var(--text-main)", fontSize: "0.92rem" }}>
                    {product.name}
                  </strong>
                  {product.description && (
                    <small style={{ display: "block", color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 2 }}>
                      {product.description.length > 55 ? `${product.description.slice(0, 55)}...` : product.description}
                    </small>
                  )}
                </td>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#3b82f6",
                      background: "#eff6ff",
                      padding: "2px 8px",
                      borderRadius: 9999,
                    }}
                  >
                    {product.category?.name || product.categoryName || "General"}
                  </span>
                </td>
                <td>
                  <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>
                    {formatCurrency(product.sellingPrice ?? product.price)}
                  </strong>
                </td>
                <td>
                  <span className={`badge ${isInactive ? "badge-danger" : "badge-success"}`}>
                    {product.status || "ACTIVE"}
                  </span>
                </td>
                {canEdit && (
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                      {onEdit && (
                        <button
                          type="button"
                          className="secondary-btn"
                          style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                          onClick={() => onEdit(product)}
                        >
                          Edit
                        </button>
                      )}
                      {onToggleStatus && (
                        <button
                          type="button"
                          className={isInactive ? "secondary-btn" : "danger-btn"}
                          style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                          onClick={() => {
                            const newStatus = isInactive ? "ACTIVE" : "INACTIVE";
                            if (window.confirm(`Change status of "${product.name}" to ${newStatus}?`)) {
                              onToggleStatus(id, newStatus);
                            }
                          }}
                        >
                          {isInactive ? "Activate" : "Deactivate"}
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;

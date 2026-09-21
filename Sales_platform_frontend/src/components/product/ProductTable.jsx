import { formatCurrency } from "../../utils/formatCurrency";

function ProductTable({ products = [], onEdit, onToggleStatus, userRole = "ADMIN" }) {
  const canEdit = ["ADMIN", "MANAGER", "EMPLOYEE"].includes(userRole);

  if (!products.length) {
    return <div className="empty-state">No products found.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            {canEdit && <th style={{ textAlign: "right" }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const id = product.id ?? product.productId;
            const isInactive = product.status === "INACTIVE";

            return (
              <tr key={id}>
                <td>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="table-img"
                    />
                  ) : (
                    <div className="table-img-placeholder">📦</div>
                  )}
                </td>
                <td>
                  <span className="sku-badge">{product.sku || "-"}</span>
                </td>
                <td>
                  <strong>{product.name}</strong>
                  {product.description && (
                    <small className="table-subtext">{product.description.slice(0, 50)}...</small>
                  )}
                </td>
                <td>{product.category?.name || product.categoryName || "-"}</td>
                <td>
                  <strong>{formatCurrency(product.sellingPrice ?? product.price)}</strong>
                </td>
                <td>
                  <span className={`badge ${isInactive ? "badge-danger" : "badge-success"}`}>
                    {product.status || "ACTIVE"}
                  </span>
                </td>
                {canEdit && (
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 8 }}>
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


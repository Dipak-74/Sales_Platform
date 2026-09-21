function InventoryAnalyticsCard({ inventory = {}, inventoryMovements = [] }) {
  const total = Number(inventory.totalProducts || 0);
  const inStock = Number(inventory.inStock || 0);
  const lowStock = Number(inventory.lowStock || 0);
  const outOfStock = Number(inventory.outOfStock || 0);

  const inStockPercent = total > 0 ? ((inStock / total) * 100).toFixed(0) : 0;
  const lowStockPercent = total > 0 ? ((lowStock / total) * 100).toFixed(0) : 0;
  const outOfStockPercent = total > 0 ? ((outOfStock / total) * 100).toFixed(0) : 0;

  const movementMap = { IN: 0, OUT: 0, ADJUSTMENT: 0 };
  (inventoryMovements || []).forEach((m) => {
    if (m.type && movementMap[m.type] !== undefined) {
      movementMap[m.type] = Number(m.quantity || 0);
    }
  });

  return (
    <div className="panel-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem" }}>Inventory Health & Movements</h3>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Current warehouse availability and transactional flow during the selected period
        </p>
      </div>

      {/* Stock Health Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: 8,
            padding: "10px 12px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "0.72rem", color: "#065f46", textTransform: "uppercase", fontWeight: 700 }}>
            In Stock
          </span>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#10b981", margin: "2px 0" }}>
            {inStock}
          </div>
          <small style={{ color: "#065f46", fontSize: "0.7rem" }}>{inStockPercent}% catalog</small>
        </div>

        <div
          style={{
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            borderRadius: 8,
            padding: "10px 12px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "0.72rem", color: "#92400e", textTransform: "uppercase", fontWeight: 700 }}>
            Low Stock
          </span>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f59e0b", margin: "2px 0" }}>
            {lowStock}
          </div>
          <small style={{ color: "#92400e", fontSize: "0.7rem" }}>{lowStockPercent}% catalog</small>
        </div>

        <div
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: 8,
            padding: "10px 12px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "0.72rem", color: "#991b1b", textTransform: "uppercase", fontWeight: 700 }}>
            Out of Stock
          </span>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ef4444", margin: "2px 0" }}>
            {outOfStock}
          </div>
          <small style={{ color: "#991b1b", fontSize: "0.7rem" }}>{outOfStockPercent}% catalog</small>
        </div>
      </div>

      {/* Multi-segment distribution bar */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            width: "100%",
            height: 10,
            borderRadius: 5,
            display: "flex",
            overflow: "hidden",
            background: "var(--surface-soft)",
          }}
        >
          <div style={{ width: `${inStockPercent}%`, background: "#10b981" }} title={`In Stock: ${inStock}`} />
          <div style={{ width: `${lowStockPercent}%`, background: "#f59e0b" }} title={`Low Stock: ${lowStock}`} />
          <div style={{ width: `${outOfStockPercent}%`, background: "#ef4444" }} title={`Out of Stock: ${outOfStock}`} />
        </div>
      </div>

      {/* Movement Breakdown */}
      <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "0.88rem", color: "var(--text-main)" }}>
          Stock Transactions in Selected Window
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          <div style={{ background: "var(--surface-soft)", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Stock In (IN)</span>
            <strong style={{ fontSize: "1.05rem", color: "#10b981" }}>+{movementMap.IN}</strong>
          </div>
          <div style={{ background: "var(--surface-soft)", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Dispatched (OUT)</span>
            <strong style={{ fontSize: "1.05rem", color: "#ef4444" }}>-{movementMap.OUT}</strong>
          </div>
          <div style={{ background: "var(--surface-soft)", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Adjustments</span>
            <strong style={{ fontSize: "1.05rem", color: "#6366f1" }}>{movementMap.ADJUSTMENT}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryAnalyticsCard;


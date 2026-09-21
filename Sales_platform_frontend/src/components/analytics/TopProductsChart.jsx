import { formatCurrency } from "../../utils/formatCurrency";

function TopProductsChart({ products = [] }) {
  const list = products || [];
  const maxRevenue = Math.max(...list.map((p) => Number(p.revenue || 0)), 1);

  return (
    <div className="panel-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem" }}>Top Selling Products</h3>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Ranked by sales volume and generated revenue from completed orders
        </p>
      </div>

      {list.length === 0 ? (
        <div
          style={{
            flex: 1,
            minHeight: 240,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            border: "1px dashed var(--border)",
            borderRadius: 8,
          }}
        >
          <span style={{ fontSize: "2rem", marginBottom: 8 }}>🏷</span>
          <p style={{ margin: 0, fontWeight: 600 }}>No product sales recorded in this period.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {list.map((item, index) => {
            const revenue = Number(item.revenue || 0);
            const percentage = Math.min(100, Math.round((revenue / maxRevenue) * 100));

            return (
              <div key={item.product || index}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: index < 3 ? "var(--primary)" : "var(--surface-soft)",
                        color: index < 3 ? "#fff" : "var(--text-muted)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </span>
                    <strong style={{ fontSize: "0.88rem", color: "var(--text-main)" }}>
                      {item.product}
                    </strong>
                    <span
                      style={{
                        background: "var(--surface-soft)",
                        color: "var(--text-muted)",
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: "0.72rem",
                        fontWeight: 600,
                      }}
                    >
                      {item.quantitySold} units
                    </span>
                  </div>

                  <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>
                    {formatCurrency(revenue)}
                  </span>
                </div>

                {/* Progress bar representing volume relative to #1 */}
                <div
                  style={{
                    width: "100%",
                    height: 6,
                    borderRadius: 3,
                    background: "var(--surface-soft)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      borderRadius: 3,
                      background: index === 0 ? "#2563eb" : index === 1 ? "#3b82f6" : "#60a5fa",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TopProductsChart;


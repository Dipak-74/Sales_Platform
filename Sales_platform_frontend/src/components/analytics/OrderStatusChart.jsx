import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const STATUS_COLORS = {
  DELIVERED: "#10b981",
  SHIPPED: "#06b6d4",
  PROCESSING: "#3b82f6",
  CONFIRMED: "#8b5cf6",
  PENDING: "#f59e0b",
  CANCELLED: "#ef4444",
};

function OrderStatusCustomTooltip({ active, payload, totalOrders }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    const val = Number(data.value || 0);
    const percent = totalOrders > 0 ? ((val / totalOrders) * 100).toFixed(1) : 0;

    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          padding: "8px 12px",
          borderRadius: 8,
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ margin: "0 0 4px 0", fontWeight: 700, fontSize: "0.85rem" }}>{data.name}</p>
        <p style={{ margin: "2px 0", fontSize: "0.8rem", color: data.payload.fill, fontWeight: 600 }}>
          {val} orders ({percent}%)
        </p>
      </div>
    );
  }
  return null;
}

function OrderStatusChart({ orderStatuses = [] }) {
  const activeList = (orderStatuses || []).filter((s) => Number(s.count || 0) > 0);
  const totalOrders = activeList.reduce((sum, item) => sum + Number(item.count || 0), 0);

  const chartData = activeList.map((s) => ({
    name: s.status,
    value: Number(s.count || 0),
  }));

  return (
    <div className="panel-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem" }}>Order Status Pipeline</h3>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Fulfillment status breakdown for all orders placed in the selected range
        </p>
      </div>

      {totalOrders === 0 ? (
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
          <span style={{ fontSize: "2rem", marginBottom: 8 }}>📦</span>
          <p style={{ margin: 0, fontWeight: 600 }}>No orders recorded in this date range.</p>
        </div>
      ) : (
        <>
          <div style={{ width: "100%", height: 210 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={STATUS_COLORS[entry.name] || "#64748b"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<OrderStatusCustomTooltip totalOrders={totalOrders} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 8,
              marginTop: 14,
            }}
          >
            {orderStatuses.map((s) => {
              const count = Number(s.count || 0);
              const color = STATUS_COLORS[s.status] || "#64748b";
              const percent = totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(0) : 0;

              return (
                <div
                  key={s.status}
                  style={{
                    background: "var(--surface-soft)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "8px 10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: color,
                      }}
                    />
                    <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "var(--text-main)" }}>
                      {s.status}
                    </span>
                  </div>
                  <strong style={{ fontSize: "0.82rem", color }}>
                    {count} <small style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>({percent}%)</small>
                  </strong>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default OrderStatusChart;


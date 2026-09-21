import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

function CategoryCustomTooltip({ active, payload, totalRevenue }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    const val = Number(data.value || 0);
    const percent = totalRevenue > 0 ? ((val / totalRevenue) * 100).toFixed(1) : 0;

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
          {formatCurrency(val)} ({percent}%)
        </p>
      </div>
    );
  }
  return null;
}

function CategoryRevenueChart({ categories = [] }) {
  const chartData = (categories || [])
    .filter((c) => Number(c.revenue || 0) > 0)
    .map((c) => ({
      name: c.category,
      value: Number(c.revenue || 0),
    }));

  const totalRevenue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="panel-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem" }}>Category Contribution</h3>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Share of gross product sales generated across catalog categories
        </p>
      </div>

      {chartData.length === 0 ? (
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
          <span style={{ fontSize: "2rem", marginBottom: 8 }}>📁</span>
          <p style={{ margin: 0, fontWeight: 600 }}>No category sales data recorded.</p>
        </div>
      ) : (
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CategoryCustomTooltip totalRevenue={totalRevenue} />} />
              <Legend
                wrapperStyle={{ fontSize: "0.78rem" }}
                formatter={(value, entry) => {
                  const item = chartData.find((d) => d.name === value);
                  const percent = totalRevenue > 0 ? ((item?.value || 0) / totalRevenue * 100).toFixed(0) : 0;
                  return `${value} (${percent}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default CategoryRevenueChart;


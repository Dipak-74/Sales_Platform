import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";

function CustomComparisonTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const rev = payload.find((p) => p.dataKey === "revenue")?.value || 0;
    const prof = payload.find((p) => p.dataKey === "profit")?.value || 0;
    const margin = rev > 0 ? ((prof / rev) * 100).toFixed(1) : "0.0";

    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          padding: "10px 14px",
          borderRadius: 8,
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ margin: "0 0 6px 0", fontWeight: 700, fontSize: "0.85rem" }}>{label}</p>
        <p style={{ margin: "3px 0", fontSize: "0.8rem", color: "#2563eb", fontWeight: 600 }}>
          Revenue: {formatCurrency(rev)}
        </p>
        <p style={{ margin: "3px 0", fontSize: "0.8rem", color: "#10b981", fontWeight: 600 }}>
          Net Profit: {formatCurrency(prof)}
        </p>
        <div
          style={{
            marginTop: 6,
            paddingTop: 6,
            borderTop: "1px solid var(--border)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          Margin: <strong>{margin}%</strong>
        </div>
      </div>
    );
  }
  return null;
}

function RevenueProfitChart({ data = [], profitAvailable = true }) {
  const chartData = (data || []).map((d) => ({
    date: d.date,
    revenue: Number(d.revenue || 0),
    profit: Number(d.profit || 0),
  }));

  const hasData = chartData.some((d) => d.revenue > 0 || d.profit > 0);

  return (
    <div className="panel-card" style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem" }}>Revenue vs. Net Profit</h3>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Side-by-side comparison of gross turnover against net margin (Revenue minus Cost of Goods Sold)
        </p>
      </div>

      {!hasData ? (
        <div
          style={{
            height: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            border: "1px dashed var(--border)",
            borderRadius: 8,
          }}
        >
          <span style={{ fontSize: "2rem", marginBottom: 8 }}>📊</span>
          <p style={{ margin: 0, fontWeight: 600 }}>No revenue/profit comparison available for this period.</p>
          <small>
            {!profitAvailable
              ? "Product cost prices have not been specified in the catalog."
              : "Verify orders and payment entries to generate margin comparisons."}
          </small>
        </div>
      ) : (
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
              />
              <Tooltip content={<CustomComparisonTooltip />} />
              <Legend wrapperStyle={{ fontSize: "0.8rem", paddingTop: 12 }} />
              <Bar dataKey="revenue" name="Total Revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default RevenueProfitChart;


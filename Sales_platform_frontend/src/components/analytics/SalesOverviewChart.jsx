import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
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
        {payload.map((entry, index) => (
          <p
            key={`tooltip-${index}`}
            style={{ margin: "3px 0", fontSize: "0.8rem", color: entry.color, fontWeight: 600 }}
          >
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function SalesOverviewChart({ data = [] }) {
  const [viewMode, setViewMode] = useState("daily"); // "daily" | "weekly" | "monthly"

  const aggregatedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    if (viewMode === "daily") {
      return data.map((d) => ({
        date: d.date,
        revenue: Number(d.revenue || 0),
        profit: Number(d.profit || 0),
      }));
    }

    if (viewMode === "monthly") {
      const map = {};
      data.forEach((d) => {
        const monthKey = (d.date || "").slice(0, 7) || "Current";
        if (!map[monthKey]) {
          map[monthKey] = { date: monthKey, revenue: 0, profit: 0 };
        }
        map[monthKey].revenue += Number(d.revenue || 0);
        map[monthKey].profit += Number(d.profit || 0);
      });
      return Object.values(map);
    }

    // weekly grouping
    const map = {};
    data.forEach((d) => {
      const dt = new Date(d.date);
      const weekStart = new Date(dt);
      weekStart.setDate(dt.getDate() - dt.getDay());
      const weekKey = weekStart.toISOString().slice(0, 10);
      if (!map[weekKey]) {
        map[weekKey] = { date: `Wk ${weekKey.slice(5)}`, revenue: 0, profit: 0 };
      }
      map[weekKey].revenue += Number(d.revenue || 0);
      map[weekKey].profit += Number(d.profit || 0);
    });
    return Object.values(map);
  }, [data, viewMode]);

  const hasData = aggregatedData.some((d) => d.revenue > 0);

  return (
    <div className="panel-card" style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem" }}>Sales & Revenue Velocity</h3>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.82rem" }}>
            Trendline of gross sales revenue recorded across the selected dates
          </p>
        </div>

        <div style={{ display: "flex", gap: 6, background: "var(--surface-soft)", padding: 4, borderRadius: 8 }}>
          {["daily", "weekly", "monthly"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={viewMode === mode ? "primary-btn" : "secondary-btn"}
              style={{
                fontSize: "0.75rem",
                padding: "4px 10px",
                borderRadius: 6,
                textTransform: "capitalize",
              }}
            >
              {mode}
            </button>
          ))}
        </div>
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
          <span style={{ fontSize: "2rem", marginBottom: 8 }}>📈</span>
          <p style={{ margin: 0, fontWeight: 600 }}>No sales revenue recorded in this date range.</p>
          <small>Completed orders with verified payments will automatically populate this chart.</small>
        </div>
      ) : (
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={aggregatedData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "0.8rem", paddingTop: 12 }} />
              <Line
                type="monotone"
                name="Gross Revenue"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, fill: "#2563eb" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default SalesOverviewChart;


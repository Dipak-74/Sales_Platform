import { formatCurrency } from "../../utils/formatCurrency";

function KpiCards({ summary = {}, profitAvailable = true }) {
  const revenue = Number(summary.totalRevenue || 0);
  const prevRevenue = Number(summary.previousPeriodRevenue || 0);
  const profit = Number(summary.totalProfit || 0);
  const orders = Number(summary.totalOrders || 0);
  const customers = Number(summary.totalCustomers || 0);
  const aov = Number(summary.averageOrderValue || 0);
  const lowStock = Number(summary.lowStockProducts || 0);

  // Growth calculation vs previous period
  let revenueTrendText = "No previous period data";
  let isPositiveGrowth = true;
  if (prevRevenue > 0) {
    const change = ((revenue - prevRevenue) / prevRevenue) * 100;
    isPositiveGrowth = change >= 0;
    revenueTrendText = `${isPositiveGrowth ? "+" : ""}${change.toFixed(1)}% vs prev period`;
  } else if (revenue > 0) {
    revenueTrendText = "New period volume";
  }

  // Margin calculation
  const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : "0.0";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 16,
        marginBottom: 24,
      }}
    >
      {/* Total Revenue */}
      <div className="panel-card" style={{ borderLeft: "4px solid #2563eb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
            Total Revenue
          </span>
          <span style={{ fontSize: "1.2rem", color: "#2563eb" }}>₹</span>
        </div>
        <div style={{ fontSize: "1.75rem", fontWeight: 800, margin: "8px 0 4px 0", color: "var(--text-main)" }}>
          {formatCurrency(revenue)}
        </div>
        <div style={{ fontSize: "0.78rem", color: prevRevenue > 0 && isPositiveGrowth ? "#10b981" : prevRevenue > 0 ? "#ef4444" : "var(--text-muted)", fontWeight: 600 }}>
          {revenueTrendText}
        </div>
      </div>

      {/* Total Profit */}
      <div className="panel-card" style={{ borderLeft: "4px solid #10b981" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
            Net Profit
          </span>
          <span style={{ fontSize: "1.2rem", color: "#10b981" }}>↗</span>
        </div>
        <div style={{ fontSize: "1.75rem", fontWeight: 800, margin: "8px 0 4px 0", color: "var(--text-main)" }}>
          {profitAvailable ? formatCurrency(profit) : "Pending"}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
          {profitAvailable ? `Net Margin: ${margin}%` : "Catalog cost prices required"}
        </div>
      </div>

      {/* Total Orders */}
      <div className="panel-card" style={{ borderLeft: "4px solid #8b5cf6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
            Completed Orders
          </span>
          <span style={{ fontSize: "1.2rem", color: "#8b5cf6" }}>🛒</span>
        </div>
        <div style={{ fontSize: "1.75rem", fontWeight: 800, margin: "8px 0 4px 0", color: "var(--text-main)" }}>
          {orders}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
          Valid fulfilled orders
        </div>
      </div>

      {/* Average Order Value (AOV) */}
      <div className="panel-card" style={{ borderLeft: "4px solid #f59e0b" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
            Average Order Value
          </span>
          <span style={{ fontSize: "1.2rem", color: "#f59e0b" }}>⚖</span>
        </div>
        <div style={{ fontSize: "1.75rem", fontWeight: 800, margin: "8px 0 4px 0", color: "var(--text-main)" }}>
          {formatCurrency(aov)}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
          Revenue generated per order
        </div>
      </div>

      {/* Customers */}
      <div className="panel-card" style={{ borderLeft: "4px solid #06b6d4" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
            Total Customers
          </span>
          <span style={{ fontSize: "1.2rem", color: "#06b6d4" }}>👥</span>
        </div>
        <div style={{ fontSize: "1.75rem", fontWeight: 800, margin: "8px 0 4px 0", color: "var(--text-main)" }}>
          {customers}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
          Registered clients in database
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div
        className="panel-card"
        style={{
          borderLeft: `4px solid ${lowStock > 0 ? "#ef4444" : "#10b981"}`,
          background: lowStock > 0 ? "rgba(239, 68, 68, 0.04)" : undefined,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
            Low Stock Warnings
          </span>
          <span style={{ fontSize: "1.2rem", color: lowStock > 0 ? "#ef4444" : "#10b981" }}>
            {lowStock > 0 ? "⚠" : "✓"}
          </span>
        </div>
        <div
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            margin: "8px 0 4px 0",
            color: lowStock > 0 ? "#dc2626" : "var(--text-main)",
          }}
        >
          {lowStock}
        </div>
        <div
          style={{
            fontSize: "0.78rem",
            color: lowStock > 0 ? "#dc2626" : "#10b981",
            fontWeight: 600,
          }}
        >
          {lowStock > 0 ? "Items at or below reorder limit" : "Inventory levels healthy"}
        </div>
      </div>
    </div>
  );
}

export default KpiCards;


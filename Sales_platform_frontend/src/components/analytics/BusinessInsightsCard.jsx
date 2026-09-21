import { formatCurrency } from "../../utils/formatCurrency";

function BusinessInsightsCard({
  summary = {},
  categories = [],
  topCustomers = [],
  orderStatuses = [],
  profitAvailable = true,
}) {
  const revenue = Number(summary.totalRevenue || 0);
  const profit = Number(summary.totalProfit || 0);
  const orders = Number(summary.totalOrders || 0);
  const lowStock = Number(summary.lowStockProducts || 0);

  const insights = [];

  // Insight 1: Category Dominance
  if (categories && categories.length > 0 && revenue > 0) {
    const topCat = categories[0];
    const topCatRev = Number(topCat.revenue || 0);
    const catPercent = ((topCatRev / revenue) * 100).toFixed(0);
    insights.push({
      icon: "🏆",
      title: `Top Category: ${topCat.category}`,
      description: `${topCat.category} generated ${formatCurrency(topCatRev)} (${catPercent}% of total revenue) during this period. Focus marketing spend here to maximize return.`,
      type: "success",
    });
  }

  // Insight 2: Profit Margin Health
  if (profitAvailable && revenue > 0) {
    const margin = (profit / revenue) * 100;
    if (margin >= 25) {
      insights.push({
        icon: "📈",
        title: `Strong Profit Margin (${margin.toFixed(1)}%)`,
        description: `Current pricing strategies yield healthy unit economics above benchmark thresholds.`,
        type: "success",
      });
    } else if (margin >= 10) {
      insights.push({
        icon: "⚖",
        title: `Moderate Profit Margin (${margin.toFixed(1)}%)`,
        description: `Profitability is stable, but can be optimized by controlling cost prices or bundled promotions.`,
        type: "info",
      });
    } else {
      insights.push({
        icon: "⚠",
        title: `Slim Profit Margin (${margin.toFixed(1)}%)`,
        description: `Gross margins are tight. Review product procurement costs and discount levels to avoid margin erosion.`,
        type: "warning",
      });
    }
  }

  // Insight 3: Inventory Stock Alert
  if (lowStock > 0) {
    insights.push({
      icon: "🚨",
      title: `Stock Replenishment Urgency`,
      description: `${lowStock} product(s) have fallen to or below minimum inventory thresholds. Reorder immediately to avoid stockout friction.`,
      type: "warning",
    });
  } else {
    insights.push({
      icon: "🛡",
      title: `Healthy Stock Levels`,
      description: `All catalog products currently meet or exceed safety threshold minimums.`,
      type: "success",
    });
  }

  // Insight 4: Order Pipeline Status
  const pendingCount =
    Number(orderStatuses.find((s) => s.status === "PENDING")?.count || 0);
  if (pendingCount > 0) {
    insights.push({
      icon: "⏳",
      title: `${pendingCount} Pending Order(s) Awaiting Confirmation`,
      description: `There are orders awaiting customer payment verification or staff processing in the fulfillment pipeline.`,
      type: "info",
    });
  }

  // Insight 5: Customer Concentration
  if (topCustomers.length > 0 && revenue > 0) {
    const topCust = topCustomers[0];
    const custSpend = Number(topCust.totalSpent || 0);
    const concentration = (custSpend / revenue) * 100;
    if (concentration >= 40) {
      insights.push({
        icon: "🤝",
        title: `High Client Concentration (${concentration.toFixed(0)}%)`,
        description: `${topCust.customer} accounts for ${concentration.toFixed(0)}% of turnover. Diversify acquisition to reduce client dependency risks.`,
        type: "info",
      });
    }
  }

  return (
    <div className="panel-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem" }}>Automated Business Insights</h3>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Algorithmic heuristics dynamically evaluated against live transactional data
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {insights.map((item, idx) => {
          const borderColor =
            item.type === "warning"
              ? "#ef4444"
              : item.type === "success"
              ? "#10b981"
              : "#3b82f6";
          const bgColor =
            item.type === "warning"
              ? "rgba(239, 68, 68, 0.04)"
              : item.type === "success"
              ? "rgba(16, 185, 129, 0.04)"
              : "rgba(59, 130, 246, 0.04)";

          return (
            <div
              key={idx}
              style={{
                borderLeft: `3px solid ${borderColor}`,
                background: bgColor,
                padding: "10px 14px",
                borderRadius: "0 8px 8px 0",
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>{item.icon}</span>
              <div>
                <strong style={{ fontSize: "0.86rem", color: "var(--text-main)", display: "block", marginBottom: 2 }}>
                  {item.title}
                </strong>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BusinessInsightsCard;


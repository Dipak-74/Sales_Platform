
import { formatCurrency } from "../../utils/formatCurrency";

function KpiCards({ summary = {}, profitAvailable = true }) {
  const revenue = Number(summary.totalRevenue || 0);
  const prevRevenue = Number(summary.previousPeriodRevenue || 0);
  const profit = Number(summary.totalProfit || 0);
  const orders = Number(summary.totalOrders || 0);
  const customers = Number(summary.totalCustomers || 0);
  const aov = Number(summary.averageOrderValue || 0);
  const lowStock = Number(summary.lowStockProducts || 0);

  // Revenue growth compared with previous period
  let revenueTrendText = "Baseline period";
  let isPositiveGrowth = true;

  if (prevRevenue > 0) {
    const change = ((revenue - prevRevenue) / prevRevenue) * 100;

    isPositiveGrowth = change >= 0;

    revenueTrendText = `${
      isPositiveGrowth ? "+" : ""
    }${change.toFixed(1)}% vs prev`;
  } else if (revenue > 0) {
    revenueTrendText = "Positive volume";
  }

  // Profit margin
  const margin =
    revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : "0.0";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 18,
        marginBottom: 24,
      }}
    >
      {/* Total Revenue */}
      <div
        className="panel-card"
        style={{
          borderTop: "3px solid #2563eb",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.76rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              Total Revenue
            </span>

            <div
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                margin: "6px 0 2px",
                color: "var(--text-main)",
                letterSpacing: "-0.03em",
              }}
            >
              {formatCurrency(revenue)}
            </div>
          </div>

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#eff6ff",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: "0.74rem",
              fontWeight: 700,
              color:
                prevRevenue > 0
                  ? isPositiveGrowth
                    ? "#16a34a"
                    : "#dc2626"
                  : "#64748b",
              background:
                prevRevenue > 0
                  ? isPositiveGrowth
                    ? "#f0fdf4"
                    : "#fef2f2"
                  : "#f1f5f9",
              padding: "2px 7px",
              borderRadius: 4,
            }}
          >
            {revenueTrendText}
          </span>
        </div>
      </div>

      {/* Net Profit */}
      <div
        className="panel-card"
        style={{
          borderTop: "3px solid #10b981",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.76rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              Net Profit
            </span>

            <div
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                margin: "6px 0 2px",
                color: "var(--text-main)",
                letterSpacing: "-0.03em",
              }}
            >
              {profitAvailable
                ? formatCurrency(profit)
                : "Calculating..."}
            </div>
          </div>

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#ecfdf5",
              color: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <span
            style={{
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              fontWeight: 600,
            }}
          >
            {profitAvailable
              ? `Net Margin: ${margin}%`
              : "Catalog cost prices required"}
          </span>
        </div>
      </div>

      {/* Fulfilled Orders */}
      <div
        className="panel-card"
        style={{
          borderTop: "3px solid #8b5cf6",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.76rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              Fulfilled Orders
            </span>

            <div
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                margin: "6px 0 2px",
                color: "var(--text-main)",
                letterSpacing: "-0.03em",
              }}
            >
              {orders}
            </div>
          </div>

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#faf5ff",
              color: "#7c3aed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <span
            style={{
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              fontWeight: 600,
            }}
          >
            Valid fulfilled orders
          </span>
        </div>
      </div>

      {/* Average Order Value */}
      <div
        className="panel-card"
        style={{
          borderTop: "3px solid #f59e0b",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.76rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              Average Order Value
            </span>

            <div
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                margin: "6px 0 2px",
                color: "var(--text-main)",
                letterSpacing: "-0.03em",
              }}
            >
              {formatCurrency(aov)}
            </div>
          </div>

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#fffbeb",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <span
            style={{
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              fontWeight: 600,
            }}
          >
            Revenue generated per order
          </span>
        </div>
      </div>

      {/* Total Customers */}
      <div
        className="panel-card"
        style={{
          borderTop: "3px solid #06b6d4",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.76rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              Total Customers
            </span>

            <div
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                margin: "6px 0 2px",
                color: "var(--text-main)",
                letterSpacing: "-0.03em",
              }}
            >
              {customers}
            </div>
          </div>

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#ecfeff",
              color: "#0891b2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <span
            style={{
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              fontWeight: 600,
            }}
          >
            Registered clients in database
          </span>
        </div>
      </div>

      {/* Low Stock Warnings */}
      <div
        className="panel-card"
        style={{
          borderTop: `3px solid ${
            lowStock > 0 ? "#ef4444" : "#10b981"
          }`,
          background:
            lowStock > 0 ? "rgba(239, 68, 68, 0.04)" : undefined,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.76rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              Low Stock Warnings
            </span>

            <div
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                margin: "6px 0 2px",
                color:
                  lowStock > 0 ? "#dc2626" : "var(--text-main)",
                letterSpacing: "-0.03em",
              }}
            >
              {lowStock}
            </div>
          </div>

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: lowStock > 0 ? "#fef2f2" : "#ecfdf5",
              color: lowStock > 0 ? "#dc2626" : "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {lowStock > 0 ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <span
            style={{
              fontSize: "0.78rem",
              color: lowStock > 0 ? "#dc2626" : "#16a34a",
              fontWeight: 600,
            }}
          >
            {lowStock > 0
              ? "Items at or below reorder limit"
              : "Inventory levels healthy"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default KpiCards;

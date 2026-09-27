
function StatCard({
  label,
  value,
  helper,
  icon,
  trend,
  variant = "blue",
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "green":
        return {
          iconBg: "#ecfdf5",
          iconColor: "#059669",
          borderTop: "3px solid #10b981",
        };

      case "purple":
        return {
          iconBg: "#faf5ff",
          iconColor: "#7c3aed",
          borderTop: "3px solid #8b5cf6",
        };

      case "amber":
        return {
          iconBg: "#fffbeb",
          iconColor: "#d97706",
          borderTop: "3px solid #f59e0b",
        };

      case "red":
        return {
          iconBg: "#fef2f2",
          iconColor: "#dc2626",
          borderTop: "3px solid #ef4444",
        };

      case "blue":
      default:
        return {
          iconBg: "#eff6ff",
          iconColor: "#2563eb",
          borderTop: "3px solid #3b82f6",
        };
    }
  };

  const styles = getVariantStyles();

  const isPositiveTrend =
    trend &&
    (trend.startsWith("+") || trend.toLowerCase().includes("up"));

  return (
    <div
      className="panel-card stat-card"
      style={{
        borderTop: styles.borderTop,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "22px 24px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              color: "var(--text-muted)",
              fontSize: "0.78rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </span>

          <strong
            style={{
              display: "block",
              fontSize: "clamp(1.75rem, 2vw, 2.15rem)",
              fontWeight: 800,
              color: "var(--text-main)",
              letterSpacing: "-0.03em",
              margin: "6px 0 2px",
              lineHeight: 1.15,
            }}
          >
            {value ?? "0"}
          </strong>
        </div>

        {/* Icon */}
        {icon && (
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: styles.iconBg,
              color: styles.iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Helper + Trend */}
      {(helper || trend) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 14,
          }}
        >
          {trend && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontSize: "0.74rem",
                fontWeight: 700,
                color: isPositiveTrend ? "#16a34a" : "#dc2626",
                background: isPositiveTrend ? "#f0fdf4" : "#fef2f2",
                padding: "2px 7px",
                borderRadius: 4,
              }}
            >
              {trend}
            </span>
          )}

          {helper && (
            <small
              style={{
                color: "var(--text-muted)",
                fontSize: "0.82rem",
                fontWeight: 500,
              }}
            >
              {helper}
            </small>
          )}
        </div>
      )}
    </div>
  );
}

export default StatCard;
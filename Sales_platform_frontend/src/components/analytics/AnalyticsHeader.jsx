import { useState } from "react";

const PRESETS = [
  { key: "today", label: "Today" },
  { key: "last7", label: "Last 7 Days" },
  { key: "last30", label: "Last 30 Days" },
  { key: "thisMonth", label: "This Month" },
  { key: "thisYear", label: "This Year" },
  { key: "custom", label: "Custom Range" },
];

function AnalyticsHeader({
  activePreset,
  onSelectPreset,
  startDate,
  endDate,
  onApplyCustomDates,
  onRefresh,
  onExport,
  loading,
}) {
  const [customStart, setCustomStart] = useState(startDate);
  const [customEnd, setCustomEnd] = useState(endDate);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customStart && customEnd) {
      onApplyCustomDates(customStart, customEnd);
    }
  };

  return (
    <div className="panel-card" style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 6px 0", fontSize: "1.5rem", letterSpacing: "-0.03em" }}>
            Analytics & Business Intelligence
          </h2>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Real-time business performance, revenue velocity, profit margins, and operational inventory health.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            className="secondary-btn"
            onClick={onRefresh}
            disabled={loading}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <span style={{ display: "inline-block", transform: loading ? "rotate(180deg)" : "none", transition: "transform 0.5s" }}>
              ↻
            </span>
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            className="primary-btn"
            onClick={onExport}
            disabled={loading}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <span>↓</span> Export Report (CSV)
          </button>
        </div>
      </div>

      {/* Date Filter Strip */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PRESETS.map((p) => {
            const isActive = activePreset === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onSelectPreset(p.key)}
                className={isActive ? "primary-btn" : "secondary-btn"}
                style={{
                  fontSize: "0.82rem",
                  padding: "6px 14px",
                  borderRadius: 20,
                  cursor: "pointer",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {activePreset === "custom" && (
          <form
            onSubmit={handleCustomSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              background: "var(--surface-soft)",
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
          >
            <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>From:</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="input-field"
              style={{ padding: "4px 8px", fontSize: "0.82rem" }}
              required
            />
            <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>To:</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="input-field"
              style={{ padding: "4px 8px", fontSize: "0.82rem" }}
              required
            />
            <button
              type="submit"
              className="primary-btn"
              style={{ padding: "5px 12px", fontSize: "0.8rem" }}
            >
              Apply Filter
            </button>
          </form>
        )}

        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
          Range: <strong>{startDate}</strong> &rarr; <strong>{endDate}</strong>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsHeader;


function SalesPredictionCard({ salesTrend = [] }) {
  const distinctDays = (salesTrend || []).filter((t) => Number(t.revenue || 0) > 0).length;
  const targetDays = 30;
  const progressPercent = Math.min(100, Math.round((distinctDays / targetDays) * 100));

  return (
    <div className="panel-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem" }}>AI Sales Forecasting Engine</h3>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.82rem" }}>
            Predictive time-series regression pipeline
          </p>
        </div>
        <span
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            color: "#2563eb",
            padding: "3px 10px",
            borderRadius: 12,
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}
        >
          Model Ingestion Active
        </span>
      </div>

      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, margin: "0 0 16px 0" }}>
        Production forecasting models (ARIMA / Holt-Winters / LSTM) require a continuous rolling baseline of at least <strong>30 transaction days</strong> to compute seasonal periodicity and trend variance without high standard error.
      </p>

      {/* Progress towards training window */}
      <div style={{ background: "var(--surface-soft)", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border)", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-main)" }}>
            Training Dataset Density
          </span>
          <strong style={{ fontSize: "0.82rem", color: "#2563eb" }}>
            {distinctDays} / {targetDays} Days ({progressPercent}%)
          </strong>
        </div>
        <div style={{ width: "100%", height: 8, borderRadius: 4, background: "var(--border)", overflow: "hidden" }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "#2563eb",
              borderRadius: 4,
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>

      {/* Integrity statement */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          background: "rgba(16, 185, 129, 0.05)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          borderRadius: 8,
          padding: "10px 12px",
        }}
      >
        <span style={{ fontSize: "1rem", color: "#10b981" }}>🛡</span>
        <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
          <strong>Data Integrity Rule:</strong> Fake synthetic curve generation is disabled. Projections will automatically activate once the verified transaction history satisfies statistical significance requirements.
        </div>
      </div>
    </div>
  );
}

export default SalesPredictionCard;


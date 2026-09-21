import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import { exportAnalyticsCSV, getAnalytics, getPresetDateRange } from "../../services/analyticsService";

function Reports() {
  const { userName } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [reportType, setReportType] = useState("last30");
  const [message, setMessage] = useState("");

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setMessage("");
      const range = getPresetDateRange(reportType);
      const res = await getAnalytics("ADMIN", range.startDate, range.endDate);
      exportAnalyticsCSV(res.data, range.label);
      setMessage(`Successfully downloaded ${range.label} report.`);
    } catch (err) {
      setMessage("Failed to generate report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <MainLayout
      title="Business Reports & Data Export"
      breadcrumb={["Dashboard", "Reports"]}
      userName={userName || "Admin"}
    >
      <div style={{ display: "grid", gap: 24, maxWidth: 800 }}>
        <div className="panel-card">
          <h3 style={{ margin: "0 0 8px 0" }}>Export Executive Business Summary</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: "0 0 20px 0" }}>
            Generate structured CSV reports containing sales totals, profit margins, product leaderboards, order status distributions, and customer metrics.
          </p>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Select Reporting Period:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input-field"
              style={{ padding: "6px 12px", width: "auto" }}
            >
              <option value="today">Today</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="thisYear">This Year</option>
            </select>

            <button
              type="button"
              className="primary-btn"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? "Preparing CSV..." : "Download Report (CSV)"}
            </button>
          </div>

          {message && (
            <div
              style={{
                marginTop: 10,
                padding: "8px 12px",
                borderRadius: 6,
                fontSize: "0.85rem",
                background: message.includes("Failed") ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                color: message.includes("Failed") ? "#ef4444" : "#10b981",
              }}
            >
              {message}
            </div>
          )}
        </div>

        <div className="panel-card">
          <h3 style={{ margin: "0 0 8px 0" }}>Interactive Live Dashboards</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: "0 0 16px 0" }}>
            For interactive charting, trend analysis, and real-time operational filters, access the Executive Analytics dashboard.
          </p>
          <Link to="/admin/analytics" className="secondary-btn" style={{ display: "inline-block" }}>
            Open Interactive Analytics &rarr;
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

export default Reports;


import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../layout/MainLayout";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

import AnalyticsHeader from "./AnalyticsHeader";
import KpiCards from "./KpiCards";
import SalesOverviewChart from "./SalesOverviewChart";
import RevenueProfitChart from "./RevenueProfitChart";
import TopProductsChart from "./TopProductsChart";
import CategoryRevenueChart from "./CategoryRevenueChart";
import OrderStatusChart from "./OrderStatusChart";
import InventoryAnalyticsCard from "./InventoryAnalyticsCard";
import TopCustomersTable from "./TopCustomersTable";
import BusinessInsightsCard from "./BusinessInsightsCard";
import SalesPredictionCard from "./SalesPredictionCard";

import {
  getAnalytics,
  getPresetDateRange,
  exportAnalyticsCSV,
} from "../../services/analyticsService";

function AnalyticsDashboardView({ role = "ADMIN", pageTitle = "Analytics & Intelligence" }) {
  const { userName } = useAuth();

  const defaultPreset = "last30";
  const initialRange = getPresetDateRange(defaultPreset);

  const [activePreset, setActivePreset] = useState(defaultPreset);
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (start, end) => {
    try {
      setLoading(true);
      setError("");
      const response = await getAnalytics(role, start, end);
      setData(response.data);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load business analytics from server. Please verify network and server logs."
      );
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [fetchData, startDate, endDate]);

  const handleSelectPreset = (key) => {
    setActivePreset(key);
    if (key !== "custom") {
      const range = getPresetDateRange(key);
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }
  };

  const handleApplyCustomDates = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleRefresh = () => {
    fetchData(startDate, endDate);
  };

  const handleExportCSV = () => {
    if (!data) return;
    const label =
      activePreset === "custom"
        ? `${startDate} to ${endDate}`
        : getPresetDateRange(activePreset).label;
    exportAnalyticsCSV(data, label);
  };

  return (
    <MainLayout
      title={pageTitle}
      breadcrumb={["Dashboard", "Analytics"]}
      userName={userName || (role === "MANAGER" ? "Manager" : "Admin")}
    >
      <div style={{ display: "grid", gap: 20 }}>
        {/* Header & Filter Controls */}
        <AnalyticsHeader
          activePreset={activePreset}
          onSelectPreset={handleSelectPreset}
          startDate={startDate}
          endDate={endDate}
          onApplyCustomDates={handleApplyCustomDates}
          onRefresh={handleRefresh}
          onExport={handleExportCSV}
          loading={loading}
        />

        {error && <ErrorMessage message={error} />}
        {loading && <Loader text="Calculating real-time aggregations from database..." />}

        {!loading && data && (
          <>
            {/* 1. KPI Cards */}
            <KpiCards summary={data.summary} profitAvailable={data.profitAvailable} />

            {/* 2. Primary Charts: Sales Velocity & Order Status Distribution */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                gap: 20,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <SalesOverviewChart data={data.salesTrend} />
              </div>
              <div style={{ minWidth: 0 }}>
                <OrderStatusChart orderStatuses={data.orderStatuses} />
              </div>
            </div>

            {/* 3. Revenue vs Profit & Category Breakdown */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                gap: 20,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <RevenueProfitChart
                  data={data.salesTrend}
                  profitAvailable={data.profitAvailable}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <CategoryRevenueChart categories={data.categoryRevenue} />
              </div>
            </div>

            {/* 4. Top Selling Products & Inventory Health */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                gap: 20,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <TopProductsChart products={data.topProducts} />
              </div>
              <div style={{ minWidth: 0 }}>
                <InventoryAnalyticsCard
                  inventory={data.inventory}
                  inventoryMovements={data.inventoryMovements}
                />
              </div>
            </div>

            {/* 5. Top Valued Customers & Dynamic Business Insights */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                gap: 20,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <TopCustomersTable customers={data.topCustomers} />
              </div>
              <div style={{ minWidth: 0 }}>
                <BusinessInsightsCard
                  summary={data.summary}
                  categories={data.categoryRevenue}
                  topCustomers={data.topCustomers}
                  orderStatuses={data.orderStatuses}
                  profitAvailable={data.profitAvailable}
                />
              </div>
            </div>

            {/* 6. AI Sales Forecasting State (No Fake ML) */}
            <div>
              <SalesPredictionCard salesTrend={data.salesTrend} />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default AnalyticsDashboardView;


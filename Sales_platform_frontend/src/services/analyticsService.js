import api from "./api";

const toIsoDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getPresetDateRange = (presetKey) => {
  const today = new Date();
  const todayStr = toIsoDateString(today);

  switch (presetKey) {
    case "today":
      return { startDate: todayStr, endDate: todayStr, label: "Today" };

    case "last7": {
      const d = new Date(today);
      d.setDate(today.getDate() - 6);
      return { startDate: toIsoDateString(d), endDate: todayStr, label: "Last 7 Days" };
    }

    case "last30": {
      const d = new Date(today);
      d.setDate(today.getDate() - 29);
      return { startDate: toIsoDateString(d), endDate: todayStr, label: "Last 30 Days" };
    }

    case "thisMonth": {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate: toIsoDateString(firstDay), endDate: todayStr, label: "This Month" };
    }

    case "thisYear": {
      const firstDay = new Date(today.getFullYear(), 0, 1);
      return { startDate: toIsoDateString(firstDay), endDate: todayStr, label: "This Year" };
    }

    default:
      return { startDate: todayStr, endDate: todayStr, label: "Custom Range" };
  }
};

export const getAnalytics = (role, startDate, endDate) =>
  api.get(`/api/${role === "MANAGER" ? "manager" : "admin"}/analytics`, {
    params: { startDate, endDate },
  });

export const exportAnalyticsCSV = (data, periodLabel = "Custom Range") => {
  if (!data) return;

  const rows = [];
  rows.push(["Smart Sales & Business Analytics Platform - Executive Report"]);
  rows.push(["Generated At", new Date().toLocaleString()]);
  rows.push(["Reporting Window", periodLabel]);
  rows.push([]);

  // KPI Summary
  rows.push(["=== EXECUTIVE SUMMARY ==="]);
  rows.push(["Metric", "Value"]);
  rows.push(["Total Orders", data.summary?.totalOrders ?? 0]);
  rows.push(["Total Revenue", `₹${(data.summary?.totalRevenue ?? 0).toFixed(2)}`]);
  rows.push(["Total Profit", `₹${(data.summary?.totalProfit ?? 0).toFixed(2)}`]);
  rows.push(["Average Order Value (AOV)", `₹${(data.summary?.averageOrderValue ?? 0).toFixed(2)}`]);
  rows.push(["Total Registered Customers", data.summary?.totalCustomers ?? 0]);
  rows.push(["Low Stock Warning Products", data.summary?.lowStockProducts ?? 0]);
  rows.push(["Previous Period Revenue", `₹${(data.summary?.previousPeriodRevenue ?? 0).toFixed(2)}`]);
  rows.push([]);

  // Top Products
  rows.push(["=== TOP SELLING PRODUCTS ==="]);
  rows.push(["Product Name", "Units Sold", "Total Revenue (₹)"]);
  (data.topProducts || []).forEach((p) => {
    rows.push([`"${p.product.replace(/"/g, '""')}"`, p.quantitySold, (p.revenue ?? 0).toFixed(2)]);
  });
  rows.push([]);

  // Category Revenue
  rows.push(["=== CATEGORY PERFORMANCE ==="]);
  rows.push(["Category", "Revenue (₹)"]);
  (data.categoryRevenue || []).forEach((c) => {
    rows.push([`"${c.category.replace(/"/g, '""')}"`, (c.revenue ?? 0).toFixed(2)]);
  });
  rows.push([]);

  // Order Statuses
  rows.push(["=== ORDER STATUS DISTRIBUTION ==="]);
  rows.push(["Status", "Count"]);
  (data.orderStatuses || []).forEach((s) => {
    rows.push([s.status, s.count]);
  });
  rows.push([]);

  // Top Customers
  rows.push(["=== TOP VALUED CLIENTS ==="]);
  rows.push(["Customer Name", "Orders Placed", "Total Spent (₹)", "AOV (₹)"]);
  (data.topCustomers || []).forEach((c) => {
    rows.push([
      `"${c.customer.replace(/"/g, '""')}"`,
      c.orders,
      (c.totalSpent ?? 0).toFixed(2),
      (c.averageOrderValue ?? 0).toFixed(2),
    ]);
  });
  rows.push([]);

  // Inventory Health
  rows.push(["=== INVENTORY HEALTH ==="]);
  rows.push(["Metric", "Count"]);
  rows.push(["Catalog Products", data.inventory?.totalProducts ?? 0]);
  rows.push(["In Stock Products", data.inventory?.inStock ?? 0]);
  rows.push(["Low Stock Threshold", data.inventory?.lowStock ?? 0]);
  rows.push(["Out of Stock Items", data.inventory?.outOfStock ?? 0]);

  const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Analytics_Report_${toIsoDateString(new Date())}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Simple metric aggregator fallback for raw client-side order lists
export const calculateSimpleMetrics = (orders = [], lowStockItems = []) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount || o.total || 0),
    0
  );

  const statusCounts = {};
  orders.forEach((o) => {
    const s = o.status || "PENDING";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const timelineMap = {};
  orders.forEach((o) => {
    const dateStr = (o.orderDate || o.createdAt || "").slice(0, 10);
    if (dateStr) {
      timelineMap[dateStr] = (timelineMap[dateStr] || 0) + Number(o.totalAmount || 0);
    }
  });

  const timelineData = Object.entries(timelineMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue }));

  return {
    totalOrders,
    totalRevenue,
    lowStockCount: lowStockItems.length,
    statusCounts,
    timelineData,
  };
};

export default {
  getAnalytics,
  getPresetDateRange,
  exportAnalyticsCSV,
  calculateSimpleMetrics,
};

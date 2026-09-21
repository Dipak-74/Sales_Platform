export const formatCurrency = (amount, currency = "INR") => {
  const num = Number(amount || 0);
  if (isNaN(num)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "INR",
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(dateString);
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(dateString);
  }
};

export const getStatusBadgeClass = (status) => {
  const map = {
    ACTIVE: "badge-success",
    CONFIRMED: "badge-success",
    DELIVERED: "badge-success",
    SUCCESS: "badge-success",
    ACCEPTED: "badge-success",
    PENDING: "badge-warning",
    PROCESSING: "badge-warning",
    SHIPPED: "badge-info",
    INACTIVE: "badge-danger",
    DISABLED: "badge-danger",
    CANCELLED: "badge-danger",
    FAILED: "badge-danger",
    EXPIRED: "badge-muted",
  };
  return map[status] || "badge";
};


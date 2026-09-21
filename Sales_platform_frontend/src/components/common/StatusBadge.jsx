function StatusBadge({ status = "UNKNOWN" }) {
  const value = String(status).toUpperCase();
  const variant = ["ACTIVE", "COMPLETED", "PAID", "SUCCESS"].includes(value) ? "badge-success" : ["INACTIVE", "CANCELLED", "FAILED"].includes(value) ? "badge-danger" : "badge-warning";
  return <span className={`badge ${variant}`}>{value}</span>;
}

export default StatusBadge;

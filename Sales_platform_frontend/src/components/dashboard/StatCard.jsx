function StatCard({ label, value, helper }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value ?? "No data"}</strong>
      {helper && <small>{helper}</small>}
    </div>
  );
}

export default StatCard;

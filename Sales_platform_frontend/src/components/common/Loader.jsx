function Loader({ text = "Loading..." }) {
  return (
    <div className="panel-card" style={{ display: "grid", placeItems: "center", minHeight: 180 }}>
      <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
        <div className="spinner" />
        <strong>{text}</strong>
      </div>
    </div>
  );
}

export default Loader;

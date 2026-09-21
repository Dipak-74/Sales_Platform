import { formatCurrency } from "../../utils/formatCurrency";

function TopCustomersTable({ customers = [] }) {
  const list = customers || [];

  return (
    <div className="panel-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem" }}>Top Valued Customers</h3>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Clients ranked by cumulative order expenditure and buying frequency
        </p>
      </div>

      {list.length === 0 ? (
        <div
          style={{
            flex: 1,
            minHeight: 240,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            border: "1px dashed var(--border)",
            borderRadius: 8,
          }}
        >
          <span style={{ fontSize: "2rem", marginBottom: 8 }}>👥</span>
          <p style={{ margin: 0, fontWeight: 600 }}>No customer purchase history in this period.</p>
        </div>
      ) : (
        <div className="table-responsive" style={{ flex: 1 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 45 }}>#</th>
                <th>Client Name</th>
                <th style={{ textAlign: "center" }}>Orders</th>
                <th style={{ textAlign: "right" }}>Total Spent</th>
                <th style={{ textAlign: "right" }}>Average Order</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c, index) => (
                <tr key={c.customer || index}>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: index === 0 ? "#2563eb" : "var(--surface-soft)",
                        color: index === 0 ? "#fff" : "var(--text-muted)",
                        textAlign: "center",
                        lineHeight: "22px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: "var(--text-main)" }}>{c.customer}</strong>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className="badge">{c.orders}</span>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>
                    {formatCurrency(c.totalSpent)}
                  </td>
                  <td style={{ textAlign: "right", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {formatCurrency(c.averageOrderValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TopCustomersTable;


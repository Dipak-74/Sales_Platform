import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getCustomers, updateCustomerStatus, getCustomerAddresses } from "../../services/customerService";

function AdminCustomers() {
  const { userName } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getCustomers();
      setCustomers(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "INACTIVE" ? "ACTIVE" : "INACTIVE";
    if (!window.confirm(`Change customer status to ${newStatus}?`)) return;

    try {
      await updateCustomerStatus(id, newStatus);
      setSuccessMsg(`Customer status updated to ${newStatus}.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadCustomers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update customer status.");
    }
  };

  const handleViewAddresses = async (customer) => {
    setSelectedCustomer(customer);
    setAddressModalOpen(true);
    try {
      setAddressLoading(true);
      const res = await getCustomerAddresses(customer.id ?? customer.customerId);
      setCustomerAddresses(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setCustomerAddresses([]);
    } finally {
      setAddressLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const name = (c.name || c.userName || "").toLowerCase();
    const email = (c.email || "").toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <MainLayout title="Customers" breadcrumb={["Dashboard", "Customers"]} userName={userName || "Admin"}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div className="panel-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>TOTAL CUSTOMERS</div>
          <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>{customers.length}</div>
        </div>
        <div className="panel-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>ACTIVE CLIENTS</div>
          <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "#10b981", marginTop: 4 }}>
            {customers.filter(c => c.status !== "INACTIVE").length}
          </div>
        </div>
        <div className="panel-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>INACTIVE</div>
          <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "#ef4444", marginTop: 4 }}>
            {customers.filter(c => c.status === "INACTIVE").length}
          </div>
        </div>
      </div>

      <div className="panel-card" style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h3 style={{ margin: 0 }}>Registered Customers</h3>
            <small style={{ color: "var(--text-muted)" }}>View client directory, contact information and addresses</small>
            <small style={{ color: "var(--text-muted)" }}>View client directory, contact information and delivery locations</small>
          </div>

          <input
            type="text"
            className="input"
            style={{ maxWidth: 280 }}
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading customers..." />
        ) : !filteredCustomers.length ? (
          <div className="empty-state">No customers found.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => {
                  const id = c.id ?? c.customerId;
                  const isInactive = c.status === "INACTIVE";
                  const nameStr = c.name || c.userName || "Customer";
                  return (
                    <tr key={id}>
                      <td>#{id}</td>
                      <td><strong>{c.name || c.userName || "-"}</strong></td>
                      <td>{c.email || "-"}</td>
                      <td>{c.phone || c.phoneNumber || "-"}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: "rgba(99, 102, 241, 0.12)",
                            color: "#6366f1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "0.88rem",
                            flexShrink: 0
                          }}>
                            {nameStr.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{nameStr}</div>
                            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>ID #{id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.88rem" }}>{c.email || "-"}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>{c.phone || c.phoneNumber || "-"}</span>
                      </td>
                      <td>
                        <span className={`badge ${isInactive ? "badge-danger" : "badge-success"}`}>
                          {c.status || "ACTIVE"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 8 }}>
                          <button
                            type="button"
                            className="secondary-btn"
                            style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                            onClick={() => handleViewAddresses(c)}
                          >
                            Addresses
                          </button>
                          <button
                            type="button"
                            className={isInactive ? "secondary-btn" : "danger-btn"}
                            style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                            onClick={() => handleToggleStatus(id, c.status)}
                          >
                            {isInactive ? "Activate" : "Deactivate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title={`Addresses - ${selectedCustomer?.name || "Customer"}`}
      >
        {addressLoading ? (
          <Loader text="Fetching addresses..." />
        ) : !customerAddresses.length ? (
          <div className="empty-state">No saved addresses on file.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {customerAddresses.map((addr, idx) => (
              <div key={addr.id ?? idx} className="panel-card" style={{ padding: 14 }}>
                <strong>{addr.addressType || "Delivery Address"}</strong>
                <p style={{ margin: "4px 0", color: "var(--text-secondary)" }}>
                  {addr.street || addr.addressLine1 || addr.address || "-"}, {addr.city || ""}, {addr.state || ""} {addr.zipCode || addr.postalCode || ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </MainLayout>
  );
}

export default AdminCustomers;

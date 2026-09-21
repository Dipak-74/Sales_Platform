import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getCustomers, getCustomerAddresses } from "../../services/customerService";

function ManagerCustomers() {
  const { userName } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <MainLayout title="Customers" breadcrumb={["Dashboard", "Customers"]} userName={userName || "Manager"}>
      <div className="panel-card" style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h3 style={{ margin: 0 }}>Customer Directory</h3>
            <small style={{ color: "var(--text-muted)" }}>View customer records and addresses</small>
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
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => {
                  const id = c.id ?? c.customerId;
                  return (
                    <tr key={id}>
                      <td>#{id}</td>
                      <td><strong>{c.name || c.userName || "-"}</strong></td>
                      <td>{c.email || "-"}</td>
                      <td>{c.phone || c.phoneNumber || "-"}</td>
                      <td>
                        <span className={`badge ${c.status === "INACTIVE" ? "badge-danger" : "badge-success"}`}>
                          {c.status || "ACTIVE"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="secondary-btn"
                          style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                          onClick={() => handleViewAddresses(c)}
                        >
                          View Addresses
                        </button>
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
          <Loader text="Loading addresses..." />
        ) : !customerAddresses.length ? (
          <div className="empty-state">No addresses recorded.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {customerAddresses.map((addr, idx) => (
              <div key={addr.id ?? idx} className="panel-card" style={{ padding: 14 }}>
                <strong>{addr.addressType || "Delivery Address"}</strong>
                <p style={{ margin: "4px 0", color: "var(--text-secondary)" }}>
                  {addr.street || addr.addressLine1 || addr.address || "-"}, {addr.city || ""}, {addr.state || ""} {addr.zipCode || ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </MainLayout>
  );
}

export default ManagerCustomers;

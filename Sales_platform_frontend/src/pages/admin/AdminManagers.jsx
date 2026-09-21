import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import {
  getManagers,
  createManager,
  updateManagerStatus,
} from "../../services/managerService";

function AdminManagers() {
  const { userName } = useAuth();

  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const loadManagers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getManagers();
      const data = Array.isArray(response?.data) ? response.data : [];
      setManagers(data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load managers."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadManagers();
  }, [loadManagers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateManager = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setError("Manager name and email are required.");
      return;
    }

    try {
      setFormSubmitting(true);
      setError("");

      const managerData = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: "MANAGER",
        status: "ACTIVE",
      };

      await createManager(managerData);

      setSuccessMsg("Manager created successfully.");
      setIsModalOpen(false);
      setForm({ name: "", email: "" });

      await loadManagers();

      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to create manager."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "INACTIVE" ? "ACTIVE" : "INACTIVE";

    const confirmed = window.confirm(
      `Change manager status to ${newStatus}?`
    );
    if (!confirmed) return;

    try {
      setError("");
      await updateManagerStatus(userId, newStatus);
      setSuccessMsg(`Manager status updated to ${newStatus}.`);
      await loadManagers();
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update manager status."
      );
    }
  };

  return (
    <MainLayout
      title="Manager Accounts"
      breadcrumb={["Dashboard", "Managers"]}
      userName={userName || "Admin"}
    >
      <div className="panel-card" style={{ display: "grid", gap: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>Managers Directory</h3>
            <small style={{ color: "var(--text-muted)" }}>
              Create and manage business unit managers
            </small>
          </div>

          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              setError("");
              setIsModalOpen(true);
            }}
          >
            + Add Manager
          </button>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading managers..." />
        ) : managers.length === 0 ? (
          <div className="empty-state">No managers found. Click &quot;+ Add Manager&quot; to create one.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((manager) => {
                  const userId = manager.userId;
                  const isInactive = manager.status === "INACTIVE";

                  return (
                    <tr key={userId}>
                      <td>#{userId}</td>
                      <td>
                        <strong>{manager.name || "-"}</strong>
                      </td>
                      <td>{manager.email || "-"}</td>
                      <td>
                        <span className="badge">
                          {manager.role || "MANAGER"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            isInactive ? "badge-danger" : "badge-success"
                          }`}
                        >
                          {manager.status || "ACTIVE"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className={isInactive ? "secondary-btn" : "danger-btn"}
                          style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                          onClick={() =>
                            handleToggleStatus(userId, manager.status)
                          }
                        >
                          {isInactive ? "Activate" : "Deactivate"}
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
        isOpen={isModalOpen}
        onClose={() => {
          if (!formSubmitting) setIsModalOpen(false);
        }}
        title="Add New Manager"
      >
        <form className="form-grid" onSubmit={handleCreateManager}>
          <div className="field-group">
            <label htmlFor="mgrName">Full Name *</label>
            <input
              id="mgrName"
              name="name"
              type="text"
              className="input"
              placeholder="Enter manager name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="mgrEmail">Email Address *</label>
            <input
              id="mgrEmail"
              name="email"
              type="email"
              className="input"
              placeholder="Enter manager Google email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 10,
            }}
          >
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setIsModalOpen(false)}
              disabled={formSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn"
              disabled={formSubmitting}
            >
              {formSubmitting ? "Creating..." : "Create Manager"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default AdminManagers;


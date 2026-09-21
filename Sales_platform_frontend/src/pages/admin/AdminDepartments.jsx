import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import {
  getAllAdminDepartments,
  createDepartment,
  updateDepartment,
  updateDepartmentStatus,
} from "../../services/departmentService";

function AdminDepartments() {
  const { userName } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
  });

  const loadDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllAdminDepartments();
      const list = Array.isArray(res?.data) ? res.data : [];
      setDepartments(list);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load departments."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const openAddModal = () => {
    setEditingDept(null);
    setForm({ name: "", description: "", status: "ACTIVE" });
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setForm({
      name: dept.name || "",
      description: dept.description || "",
      status: dept.status || "ACTIVE",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Department name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (editingDept) {
        const id = editingDept.departmentId ?? editingDept.id;
        await updateDepartment(id, form);
        setSuccessMsg("Department updated successfully.");
      } else {
        await createDepartment(form);
        setSuccessMsg("Department created successfully.");
      }

      setIsModalOpen(false);
      await loadDepartments();
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Operation failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (dept) => {
    const id = dept.departmentId ?? dept.id;
    const newStatus = dept.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const confirmed = window.confirm(`Change department status to ${newStatus}?`);
    if (!confirmed) return;

    try {
      setError("");
      await updateDepartmentStatus(id, newStatus);
      setSuccessMsg(`Department status updated to ${newStatus}.`);
      await loadDepartments();
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update department status."
      );
    }
  };

  return (
    <MainLayout
      title="Departments"
      breadcrumb={["Dashboard", "Departments"]}
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
            <h3 style={{ margin: 0 }}>Department Management</h3>
            <small style={{ color: "var(--text-muted)" }}>
              Define company divisions and departments
            </small>
          </div>

          <button type="button" className="primary-btn" onClick={openAddModal}>
            + Add Department
          </button>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading departments..." />
        ) : departments.length === 0 ? (
          <div className="empty-state">No departments configured yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => {
                  const id = dept.departmentId ?? dept.id;
                  const isInactive = dept.status === "INACTIVE";

                  return (
                    <tr key={id}>
                      <td>#{id}</td>
                      <td>
                        <strong>{dept.name}</strong>
                      </td>
                      <td>{dept.description || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            isInactive ? "badge-danger" : "badge-success"
                          }`}
                        >
                          {dept.status || "ACTIVE"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            gap: 8,
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="button"
                            className="secondary-btn"
                            style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                            onClick={() => openEditModal(dept)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={isInactive ? "secondary-btn" : "danger-btn"}
                            style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                            onClick={() => handleToggleStatus(dept)}
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
        isOpen={isModalOpen}
        onClose={() => {
          if (!submitting) setIsModalOpen(false);
        }}
        title={editingDept ? "Edit Department" : "Add Department"}
      >
        <form className="form-grid" onSubmit={handleFormSubmit}>
          <div className="field-group">
            <label htmlFor="deptName">Department Name *</label>
            <input
              id="deptName"
              className="input"
              type="text"
              placeholder="e.g. Sales, Marketing, Logistics"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="deptDesc">Description</label>
            <textarea
              id="deptDesc"
              className="input"
              rows="3"
              placeholder="Department responsibilities and scope"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="field-group">
            <label htmlFor="deptStatus">Initial Status</label>
            <select
              id="deptStatus"
              className="select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
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
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting
                ? "Saving..."
                : editingDept
                ? "Save Changes"
                : "Create Department"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default AdminDepartments;


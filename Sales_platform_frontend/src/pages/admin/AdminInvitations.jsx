import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import {
  createInvitation,
  getInvitationsByManager,
  updateInvitationStatus,
} from "../../services/invitationService";
import { getManagers } from "../../services/managerService";
import { getAllAdminDepartments } from "../../services/departmentService";

function AdminInvitations() {
  const { userName } = useAuth();

  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [invitations, setInvitations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    managerId: "",
    departmentId: "",
    designation: "",
  });

  const loadPrerequisites = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [mgrRes, deptRes] = await Promise.all([
        getManagers(),
        getAllAdminDepartments(),
      ]);

      const mgrList = Array.isArray(mgrRes?.data) ? mgrRes.data : [];
      const deptList = Array.isArray(deptRes?.data) ? deptRes.data : [];

      setManagers(mgrList);
      setDepartments(deptList);

      if (mgrList.length > 0 && !selectedManagerId) {
        setSelectedManagerId(String(mgrList[0].userId));
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load managers and departments."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedManagerId]);

  const loadInvitations = useCallback(async (mgrId) => {
    if (!mgrId) return;
    try {
      setLoading(true);
      setError("");
      const res = await getInvitationsByManager(mgrId);
      setInvitations(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load invitations for this manager."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrerequisites();
  }, [loadPrerequisites]);

  useEffect(() => {
    if (selectedManagerId) {
      loadInvitations(selectedManagerId);
    }
  }, [selectedManagerId, loadInvitations]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.managerId || !form.departmentId) {
      setError("Please provide all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        managerId: Number(form.managerId),
        departmentId: Number(form.departmentId),
        designation: form.designation.trim() || null,
      };

      await createInvitation(payload);
      setSuccessMsg("Employee invitation created successfully.");
      setIsModalOpen(false);
      setForm({
        name: "",
        email: "",
        managerId: selectedManagerId,
        departmentId: "",
        designation: "",
      });

      if (selectedManagerId === String(payload.managerId)) {
        await loadInvitations(selectedManagerId);
      } else {
        setSelectedManagerId(String(payload.managerId));
      }
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to create invitation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (invitationId, newStatus) => {
    try {
      setError("");
      await updateInvitationStatus(invitationId, newStatus);
      setSuccessMsg(`Invitation status updated to ${newStatus}.`);
      await loadInvitations(selectedManagerId);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update invitation status."
      );
    }
  };

  return (
    <MainLayout
      title="Employee Invitations"
      breadcrumb={["Dashboard", "Invitations"]}
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
            <h3 style={{ margin: 0 }}>Manager Employee Invitations</h3>
            <small style={{ color: "var(--text-muted)" }}>
              Issue and track invitations assigned to managers
            </small>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select
              className="select"
              value={selectedManagerId}
              onChange={(e) => setSelectedManagerId(e.target.value)}
            >
              {managers.map((m) => (
                <option key={m.userId} value={m.userId}>
                  Manager: {m.name} (#{m.userId})
                </option>
              ))}
            </select>

            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                setForm({
                  name: "",
                  email: "",
                  managerId: selectedManagerId,
                  departmentId: departments[0]?.departmentId ?? departments[0]?.id ?? "",
                  designation: "",
                });
                setIsModalOpen(true);
              }}
            >
              + Create Invitation
            </button>
          </div>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading invitations..." />
        ) : invitations.length === 0 ? (
          <div className="empty-state">
            No invitations found for the selected manager. Click &quot;+ Create Invitation&quot; to issue one.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Candidate Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr key={inv.invitationId}>
                    <td>#{inv.invitationId}</td>
                    <td>
                      <strong>{inv.name}</strong>
                    </td>
                    <td>{inv.email}</td>
                    <td>{inv.designation || "-"}</td>
                    <td>
                      <span
                        className={`badge ${
                          inv.status === "ACCEPTED"
                            ? "badge-success"
                            : inv.status === "PENDING"
                            ? "badge-warning"
                            : "badge-danger"
                        }`}
                      >
                        {inv.status || "PENDING"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {inv.status === "PENDING" && (
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
                            style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                            onClick={() =>
                              handleUpdateStatus(inv.invitationId, "ACCEPTED")
                            }
                          >
                            Mark Accepted
                          </button>
                          <button
                            type="button"
                            className="danger-btn"
                            style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                            onClick={() =>
                              handleUpdateStatus(inv.invitationId, "CANCELLD")
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
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
        title="Create Employee Invitation"
      >
        <form className="form-grid" onSubmit={handleCreate}>
          <div className="field-group">
            <label htmlFor="invName">Candidate Full Name *</label>
            <input
              id="invName"
              className="input"
              type="text"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="invEmail">Candidate Email *</label>
            <input
              id="invEmail"
              className="input"
              type="email"
              placeholder="Candidate's Google account email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="invManager">Assigned Manager *</label>
            <select
              id="invManager"
              className="select"
              value={form.managerId}
              onChange={(e) => setForm({ ...form, managerId: e.target.value })}
              required
            >
              <option value="">-- Select Manager --</option>
              {managers.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.name} (#{m.userId})
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="invDept">Department *</label>
            <select
              id="invDept"
              className="select"
              value={form.departmentId}
              onChange={(e) =>
                setForm({ ...form, departmentId: e.target.value })
              }
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map((d) => {
                const id = d.departmentId ?? d.id;
                return (
                  <option key={id} value={id}>
                    {d.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="invDesig">Designation</label>
            <input
              id="invDesig"
              className="input"
              type="text"
              placeholder="e.g. Sales Specialist"
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
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
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Sending..." : "Create Invitation"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default AdminInvitations;


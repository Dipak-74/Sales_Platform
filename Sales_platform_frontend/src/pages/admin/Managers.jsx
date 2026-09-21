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

console.log(localStorage.getItem("role"));
console.log(localStorage.getItem("token"));

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

  // =========================
  // LOAD MANAGERS
  // =========================

  const loadManagers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getManagers();

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      setManagers(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load managers."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadManagers();
  }, [loadManagers]);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // CREATE MANAGER
  // =========================

  const handleCreateManager = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and Email are required.");
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

      setSuccessMsg(
        "Manager created successfully."
      );

      setIsModalOpen(false);

      setForm({
        name: "",
        email: "",
      });

      await loadManagers();

      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to create manager."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // =========================
  // ACTIVATE / DEACTIVATE
  // =========================

  const handleToggleStatus = async (
    userId,
    currentStatus
  ) => {
    const newStatus =
      currentStatus === "INACTIVE"
        ? "ACTIVE"
        : "INACTIVE";

    const confirmed = window.confirm(
      `Change manager status to ${newStatus}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await updateManagerStatus(
        userId,
        newStatus
      );

      setSuccessMsg(
        `Manager status updated to ${newStatus}.`
      );

      await loadManagers();

      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to update manager status."
      );
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <MainLayout
      title="Managers"
      breadcrumb={[
        "Dashboard",
        "Managers",
      ]}
      userName={userName || "Admin"}
    >

      <div
        className="panel-card"
        style={{
          display: "grid",
          gap: 18,
        }}
      >

        {/* HEADER */}

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
            <h3 style={{ margin: 0 }}>
              Manager Accounts
            </h3>

            <small
              style={{
                color: "var(--text-muted)",
              }}
            >
              Create and manage business managers
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

        {/* SUCCESS */}

        {successMsg && (
          <div className="alert alert-success">
            {successMsg}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <ErrorMessage message={error} />
        )}

        {/* LOADING */}

        {loading ? (

          <Loader text="Loading managers..." />

        ) : managers.length === 0 ? (

          <div className="empty-state">
            No managers found.
          </div>

        ) : (

          /* TABLE */

          <div className="table-responsive">

            <table className="data-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {managers.map((manager) => {

                  const userId = manager.userId;

                  const isInactive =
                    manager.status === "INACTIVE";

                  return (

                    <tr key={userId}>

                      <td>
                        #{userId}
                      </td>

                      <td>
                        <strong>
                          {manager.name || "-"}
                        </strong>
                      </td>

                      <td>
                        {manager.email || "-"}
                      </td>

                      <td>
                        <span className="badge">
                          {manager.role || "MANAGER"}
                        </span>
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            isInactive
                              ? "badge-danger"
                              : "badge-success"
                          }`}
                        >
                          {manager.status || "ACTIVE"}
                        </span>

                      </td>

                      <td
                        style={{
                          textAlign: "right",
                        }}
                      >

                        <button
                          type="button"
                          className={
                            isInactive
                              ? "secondary-btn"
                              : "danger-btn"
                          }
                          style={{
                            padding: "6px 12px",
                            fontSize: "0.82rem",
                          }}
                          onClick={() =>
                            handleToggleStatus(
                              userId,
                              manager.status
                            )
                          }
                        >
                          {isInactive
                            ? "Activate"
                            : "Deactivate"}
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

      {/* =========================
          ADD MANAGER MODAL
          ========================= */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!formSubmitting) {
            setIsModalOpen(false);
          }
        }}
        title="Add New Manager"
      >

        <form
          className="form-grid"
          onSubmit={handleCreateManager}
        >

          {/* NAME */}

          <div className="field-group">

            <label htmlFor="mgrName">
              Full Name *
            </label>

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

          {/* EMAIL */}

          <div className="field-group">

            <label htmlFor="mgrEmail">
              Email Address *
            </label>

            <input
              id="mgrEmail"
              name="email"
              type="email"
              className="input"
              placeholder="Enter manager email"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* ROLE INFO */}

          <div className="field-group">

            <label>
              Role
            </label>

            <input
              type="text"
              className="input"
              value="MANAGER"
              disabled
            />

          </div>

          {/* STATUS INFO */}

          <div className="field-group">

            <label>
              Status
            </label>

            <input
              type="text"
              className="input"
              value="ACTIVE"
              disabled
            />

          </div>

          {/* BUTTONS */}

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
              onClick={() => {
                setIsModalOpen(false);
              }}
              disabled={formSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={formSubmitting}
            >
              {formSubmitting
                ? "Creating..."
                : "Create Manager"}
            </button>

          </div>

        </form>

      </Modal>

    </MainLayout>
  );
}

export default AdminManagers;
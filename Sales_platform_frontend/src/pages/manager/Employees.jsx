import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import {
  getEmployeesByManager,
  createEmployeeUser,
  createEmployee,
  updateEmployeeStatus,
} from "../../services/employeeService";
import { getDepartments } from "../../services/departmentService";

function ManagerEmployees() {
  const { userId, userName } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Exact same pattern as AdminManagers.jsx
  const [form, setForm] = useState({
    name: "",
    email: "",
    departmentId: "",
  });

  const loadData = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError("");

      const [empRes, deptRes] = await Promise.all([
        getEmployeesByManager(userId),
        getDepartments(),
      ]);

      setEmployees(Array.isArray(empRes?.data) ? empRes.data : []);
      setDepartments(Array.isArray(deptRes?.data) ? deptRes.data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load team employees."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openModal = () => {
    setError("");
    setForm({
      name: "",
      email: "",
      departmentId: departments[0]?.departmentId ?? departments[0]?.id ?? "",
    });
    setIsModalOpen(true);
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setError("Employee name and email are required.");
      return;
    }
    if (!form.departmentId) {
      setError("Please select a department.");
      return;
    }

    try {
      setFormSubmitting(true);
      setError("");

      const employeeData = {
        departmentId: Number(form.departmentId),
        managerId: Number(userId),
      };

      const userResponse = await createEmployeeUser({
        name: form.name.trim(),
        email: form.email.trim(),
      });
      const createdUserId = userResponse?.data?.userId ?? userResponse?.data?.id;

      if (!createdUserId) {
        throw new Error("Employee user was created without a user ID.");
      }

      await createEmployee({
        ...employeeData,
        userId: createdUserId,
      });

      setSuccessMsg("Employee added successfully.");
      setIsModalOpen(false);
      setForm({
        name: "",
        email: "",
        departmentId: departments[0]?.departmentId ?? departments[0]?.id ?? "",
      });

      await loadData();

      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to add employee."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "INACTIVE" ? "ACTIVE" : "INACTIVE";

    const confirmed = window.confirm(
      `Change employee status to ${newStatus}?`
    );
    if (!confirmed) return;

    try {
      setError("");
      await updateEmployeeStatus(id, newStatus);
      setSuccessMsg(`Employee status updated to ${newStatus}.`);
      await loadData();
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update employee status."
      );
    }
  };

  return (
    <MainLayout
      title="Team Employees"
      breadcrumb={["Dashboard", "Employees"]}
      userName={userName || "Manager"}
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
            <h3 style={{ margin: 0 }}>Team Directory</h3>
            <small style={{ color: "var(--text-muted)" }}>
              Manage team members under your supervision
            </small>
          </div>

          <button type="button" className="primary-btn" onClick={openModal}>
            + Add Employee
          </button>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading team employees..." />
        ) : employees.length === 0 ? (
          <div className="empty-state">
            No employees in your team yet. Click &quot;+ Add Employee&quot; to add a team member.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => {
                  const id = emp.employeeId ?? emp.id;
                  const isInactive = emp.status === "INACTIVE";

                  return (
                    <tr key={id}>
                      <td>
                        <code>{emp.employeeCode || `#${id}`}</code>
                      </td>
                      <td>
                        <strong>{emp.name || emp.userName || "-"}</strong>
                      </td>
                      <td>{emp.email || "-"}</td>
                      <td>
                        {emp.department?.name ||
                          emp.departmentName ||
                          departments.find(
                            (d) =>
                              String(d.departmentId ?? d.id) ===
                              String(emp.departmentId)
                          )?.name ||
                          "-"}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            isInactive ? "badge-danger" : "badge-success"
                          }`}
                        >
                          {emp.status || "ACTIVE"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className={isInactive ? "secondary-btn" : "danger-btn"}
                          style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                          onClick={() => handleToggleStatus(id, emp.status)}
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

      {/* Add Employee Modal - Identical to AdminManagers pattern */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!formSubmitting) setIsModalOpen(false);
        }}
        title="Add New Employee"
      >
        <form className="form-grid" onSubmit={handleCreateEmployee}>
          <div className="field-group">
            <label htmlFor="empName">Full Name *</label>
            <input
              id="empName"
              name="name"
              type="text"
              className="input"
              placeholder="Enter employee full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="empEmail">Email Address *</label>
            <input
              id="empEmail"
              name="email"
              type="email"
              className="input"
              placeholder="Enter employee email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="empDept">Department *</label>
            <select
              id="empDept"
              name="departmentId"
              className="select"
              value={form.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept) => {
                const id = dept.departmentId ?? dept.id;
                return (
                  <option key={id} value={id}>
                    {dept.name}
                  </option>
                );
              })}
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
              disabled={formSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn"
              disabled={formSubmitting}
            >
              {formSubmitting ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default ManagerEmployees;

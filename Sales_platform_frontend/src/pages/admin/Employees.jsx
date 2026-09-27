import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { updateUserStatus } from "../../services/userService";
import { getUsersByRole } from "../../services/userService";
import { getManagers } from "../../services/managerService";
import { getDepartments } from "../../services/departmentService";

function AdminEmployees() {
  const { userName } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [_managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [selectedDept, setSelectedDept] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [empRes, mgrRes, deptRes] = await Promise.allSettled([
        getUsersByRole("EMPLOYEE"),
        getManagers(),
        getDepartments(),
      ]);

      if (empRes.status === "fulfilled") {
        setEmployees(Array.isArray(empRes.value?.data) ? empRes.value.data : []);
      }
      if (mgrRes.status === "fulfilled") {
        setManagers(Array.isArray(mgrRes.value?.data) ? mgrRes.value.data : []);
      }
      if (deptRes.status === "fulfilled") {
        setDepartments(Array.isArray(deptRes.value?.data) ? deptRes.value.data : []);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load employee records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "INACTIVE" ? "ACTIVE" : "INACTIVE";
    if (!window.confirm(`Change employee status to ${newStatus}?`)) return;

    try {
      await updateUserStatus(id, newStatus);
      setSuccessMsg(`Employee status updated to ${newStatus}.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update employee status.");
    }
  };

  const displayedEmployees = selectedDept
    ? employees.filter((e) => String(e.departmentId ?? e.department?.id) === String(selectedDept))
    : employees;

  return (
    <MainLayout title="Employees" breadcrumb={["Dashboard", "Employees"]} userName={userName || "Admin"}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div className="panel-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>TOTAL EMPLOYEES</div>
          <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "var(--text-main)", marginTop: 4 }}>{employees.length}</div>
        </div>
        <div className="panel-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>ACTIVE STAFF</div>
          <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "#10b981", marginTop: 4 }}>
            {employees.filter(e => e.status !== "INACTIVE").length}
          </div>
        </div>
        <div className="panel-card" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>DEPARTMENTS</div>
          <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "var(--primary-color)", marginTop: 4 }}>
            {departments.length}
          </div>
        </div>
      </div>

      <div className="panel-card" style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h3 style={{ margin: 0 }}>Staff & Operations Team</h3>
            <small style={{ color: "var(--text-muted)" }}>Manage employee directory, managers and departments</small>
          </div>
          <small className="badge badge-info">Provisioned by managers</small>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <select
            className="select"
            style={{ maxWidth: 260 }}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.departmentId ?? d.id ?? d.code} value={d.departmentId ?? d.id ?? ""}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading employees..." />
        ) : !displayedEmployees.length ? (
          <div className="empty-state">No employees found.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Manager</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees.map((emp) => {
                  const id = emp.userId ?? emp.id ?? emp.employeeId ?? emp.email;
                  const isInactive = emp.status === "INACTIVE";
                  const nameStr = emp.name || emp.userName || "Employee";
                  return (
                    <tr key={id}>
                      <td>#{id}</td>
                      <td><strong>{emp.name || emp.userName || "-"}</strong></td>
                      <td>{emp.email || "-"}</td>
                      <td>{emp.department?.name || emp.departmentName || "General"}</td>
                      <td>{emp.manager?.name || emp.managerName || "-"}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: "rgba(16, 185, 129, 0.12)",
                            color: "#10b981",
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
                        <span style={{ fontSize: "0.88rem" }}>{emp.email || "-"}</span>
                      </td>
                      <td>
                        <span className="badge" style={{ background: "rgba(100, 116, 139, 0.1)", color: "var(--text-main)" }}>
                          {emp.department?.name || emp.departmentName || "General"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                          {emp.manager?.name || emp.managerName || "-"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isInactive ? "badge-danger" : "badge-success"}`}>
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

    </MainLayout>
  );
}

export default AdminEmployees;

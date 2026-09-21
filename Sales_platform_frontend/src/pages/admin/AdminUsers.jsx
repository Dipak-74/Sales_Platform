import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import {
  getUsersByRole,
  updateUserStatus,
} from "../../services/userService";

const ROLES_LIST = ["ALL", "ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER"];

function AdminUsers() {
  const { userName } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [searchEmail, setSearchEmail] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (selectedRole === "ALL") {
        const [admins, managers, employees, customers] = await Promise.allSettled([
          getUsersByRole("ADMIN"),
          getUsersByRole("MANAGER"),
          getUsersByRole("EMPLOYEE"),
          getUsersByRole("CUSTOMER"),
        ]);

        const combined = [
          ...(admins.status === "fulfilled" && Array.isArray(admins.value?.data) ? admins.value.data : []),
          ...(managers.status === "fulfilled" && Array.isArray(managers.value?.data) ? managers.value.data : []),
          ...(employees.status === "fulfilled" && Array.isArray(employees.value?.data) ? employees.value.data : []),
          ...(customers.status === "fulfilled" && Array.isArray(customers.value?.data) ? customers.value.data : []),
        ];

        // Deduplicate by userId
        const unique = Array.from(new Map(combined.map((u) => [u.userId, u])).values());
        setUsers(unique);
      } else {
        const res = await getUsersByRole(selectedRole);
        setUsers(Array.isArray(res?.data) ? res.data : []);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load user records."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleStatus = async (user) => {
    const id = user.userId;
    const newStatus = user.status === "ACTIVE" ? "DISABLED" : "ACTIVE";

    const confirmed = window.confirm(
      `Change status of user "${user.name || user.email}" to ${newStatus}?`
    );
    if (!confirmed) return;

    try {
      setError("");
      await updateUserStatus(id, newStatus);
      setSuccessMsg(`Status updated to ${newStatus}.`);
      await loadUsers();
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update user status."
      );
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchEmail.trim()) return true;
    const term = searchEmail.toLowerCase();
    return (
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.name && u.name.toLowerCase().includes(term))
    );
  });

  return (
    <MainLayout
      title="User Directory"
      breadcrumb={["Dashboard", "Users"]}
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
            <h3 style={{ margin: 0 }}>System Users</h3>
            <small style={{ color: "var(--text-muted)" }}>
              View and manage registered users across all platform roles
            </small>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="text"
              className="input"
              style={{ minWidth: 200 }}
              placeholder="Search by name or email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />

            <select
              className="select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {ROLES_LIST.map((r) => (
                <option key={r} value={r}>
                  {r === "ALL" ? "All Roles" : r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading user directory..." />
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">No users found matching your criteria.</div>
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
                {filteredUsers.map((u) => {
                  const isInactive =
                    u.status === "DISABLED" || u.status === "INACTIVE";

                  return (
                    <tr key={u.userId}>
                      <td>#{u.userId}</td>
                      <td>
                        <strong>{u.name || "-"}</strong>
                      </td>
                      <td>{u.email || "-"}</td>
                      <td>
                        <span className="badge">{u.role}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            isInactive ? "badge-danger" : "badge-success"
                          }`}
                        >
                          {u.status || "ACTIVE"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className={isInactive ? "secondary-btn" : "danger-btn"}
                          style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                          onClick={() => handleToggleStatus(u)}
                        >
                          {isInactive ? "Activate" : "Disable"}
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

export default AdminUsers;


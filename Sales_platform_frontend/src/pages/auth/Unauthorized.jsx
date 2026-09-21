import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLE_REDIRECTS } from "../../utils/constants";

function Unauthorized() {
  const navigate = useNavigate();
  const { role, isAuthenticated, logout } = useAuth();

  const handleReturn = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(ROLE_REDIRECTS[role] || "/login");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>🚫</div>
        <h2 style={{ margin: "0 0 8px 0" }}>Access Denied</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
          You do not have the required permissions to view this resource.
        </p>

        {isAuthenticated && (
          <div
            style={{
              background: "var(--bg-subtle)",
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: "0.88rem",
              marginBottom: 20,
            }}
          >
            Signed in as: <strong>{role}</strong>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button type="button" className="primary-btn" onClick={handleReturn}>
            Return to Dashboard
          </button>
          {isAuthenticated && (
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Sign In with Different Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;


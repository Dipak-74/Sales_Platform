import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLE_REDIRECTS } from "../../utils/constants";

function NotFound() {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuth();

  const handleReturn = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(ROLE_REDIRECTS[role] || "/login");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ textAlign: "center", maxWidth: 460 }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>🔍</div>
        <h2 style={{ margin: "0 0 8px 0" }}>Page Not Found (404)</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
          The requested page could not be located on this platform.
        </p>

        <button type="button" className="primary-btn" onClick={handleReturn}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFound;


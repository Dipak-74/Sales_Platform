import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../../components/GoogleLoginButton";

function GoogleRegister() {
  const navigate = useNavigate();

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge">S</div>
          <h1>Create Account</h1>
          <p>Register to access your business workspace</p>
        </div>

        <div
          style={{
            background: "var(--bg-subtle)",
            padding: 14,
            borderRadius: 10,
            fontSize: "0.88rem",
            color: "var(--text-secondary)",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Public registration automatically grants Customer access. If you are a
          manager or employee, use your registered organization email.
        </div>

        <div className="google-wrap">
          <GoogleLoginButton mode="register" />
        </div>

        <p className="auth-footer" style={{ marginTop: 24 }}>
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

export default GoogleRegister;


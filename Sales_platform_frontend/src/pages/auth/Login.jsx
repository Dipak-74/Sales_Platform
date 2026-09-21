import { useNavigate, useSearchParams } from "react-router-dom";
import GoogleLoginButton from "../../components/GoogleLoginButton";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get("reason") === "expired";

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge">S</div>
          <h1>Welcome back</h1>
          <p>Sign in to continue to your business workspace</p>
        </div>

        <p className="auth-footer" style={{ marginTop: 0 }}>Use the Google account registered with your workspace.</p>

        {sessionExpired && (
          <div className="alert alert-warning" role="status">
            Session expired. Please login again.
          </div>
        )}

        <div className="google-wrap">
          <GoogleLoginButton mode="login" />
        </div>

        <p className="auth-footer">
          Don&apos;t have an account? <button type="button" onClick={() => navigate("/register")}>Create one</button>
        </p>
      </div>
    </div>
  );
}

export default Login;

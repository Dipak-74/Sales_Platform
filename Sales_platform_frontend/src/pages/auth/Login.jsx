import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { normalLogin } from "../../services/authService";
import GoogleLoginButton from "../../components/GoogleLoginButton";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get("reason") === "expired";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim() || !password) {
      setFormError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await normalLogin(email.trim(), password);
      login(res.data);
      const role = res.data.role;
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "MANAGER") navigate("/manager/dashboard");
      else if (role === "EMPLOYEE") navigate("/employee/dashboard");
      else navigate("/customer/dashboard");
    } catch (err) {
      setFormError(
        err.response?.data?.message || err.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-layout">
      {/* Left Section: SaaS Product Showcase */}
      <div className="auth-split-hero">
        <a href="/" className="auth-hero-brand">
          <div className="auth-hero-brand-mark">S</div>
          <div>
            <strong>Smart Sales Platform</strong>
            <small>Enterprise Analytics Suite</small>
          </div>
        </a>

        <div className="auth-hero-content">
          <div className="auth-hero-kicker">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Next-Gen Business Operations</span>
          </div>

          <h1>Smart Sales &amp; Business Analytics Platform</h1>
          <p>Manage sales, customers, inventory and business insights in one unified workspace.</p>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div>
                <strong>Sales &amp; Orders</strong>
                <small>Track checkout pipelines, payments &amp; real-time fulfillment.</small>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m7.5 4.27 9 5.15" />
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </div>
              <div>
                <strong>Inventory Tracking</strong>
                <small>Automated stock deduction, reorder alerts &amp; audit trails.</small>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <strong>Customer CRM</strong>
                <small>Unified client records, addresses &amp; lifetime value metrics.</small>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div>
                <strong>Business Analytics</strong>
                <small>Executive KPI dashboards, profit margins &amp; CSV reporting.</small>
              </div>
            </div>
          </div>

          {/* SaaS Analytics Preview Card */}
          <div className="auth-mock-preview">
            <div className="auth-mock-stat">
              <small>System Operational Status</small>
              <strong>99.8% Online</strong>
            </div>
            <div className="auth-mock-badge">
              <span>●</span>
              <span>Cloud Connected</span>
            </div>
          </div>
        </div>

        <div className="auth-hero-footer">
          <span>&copy; {new Date().getFullYear()} Smart Sales Platform Inc.</span>
          <span>Encrypted Enterprise Architecture</span>
        </div>
      </div>

      {/* Right Section: Premium Login Card */}
      <div className="auth-split-form">
        <div className="auth-form-card">
          <div className="auth-header">
            <div className="auth-badge" title="Sales Platform">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1>Welcome back</h1>
            <p>Sign in to your Sales Platform workspace</p>
          </div>

          {sessionExpired && (
            <div className="alert alert-warning" role="status" style={{ marginBottom: 16 }}>
              Session expired. Please sign in again to continue.
            </div>
          )}

          {formError && (
            <div className="alert alert-error" role="status" style={{ marginBottom: 16 }}>
              {formError}
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="form-grid" style={{ marginBottom: 16 }}>
            <div className="field-group">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="field-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="login-password">Password</label>
              </div>
              <div className="password-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 42 }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="primary-btn" style={{ width: "100%", marginTop: 4 }} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="divider"><span>or continue with</span></div>

          <div className="google-wrap">
            <GoogleLoginButton mode="login" />
          </div>

          <div className="auth-security-notice">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Verified 256-bit SSL encrypted authentication</span>
          </div>

          <p className="auth-footer" style={{ marginTop: 20 }}>
            Don&apos;t have an account?{" "}
            <button type="button" onClick={() => navigate("/register")}>
              Create one
            </button>
          </p>
        </div>

        {/* Small Home / Landing Page Button at bottom */}
        <div className="auth-home-wrap">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="auth-home-btn"
            title="Return to Landing Page"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

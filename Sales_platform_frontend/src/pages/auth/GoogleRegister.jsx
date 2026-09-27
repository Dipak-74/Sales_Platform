import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { normalRegister } from "../../services/authService";
import GoogleLoginButton from "../../components/GoogleLoginButton";

function GoogleRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !email.trim() || !password) {
      setFormError("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match. Please verify.");
      return;
    }

    try {
      setLoading(true);
      const res = await normalRegister(name.trim(), email.trim(), password);
      login(res.data);
      navigate("/customer/dashboard");
    } catch (err) {
      setFormError(
        err.response?.data?.message || err.message || "Registration failed. Please try again."
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
            <span>Seamless Onboarding</span>
          </div>

          <h1>Create your business workspace account</h1>
          <p>Join thousands of growing companies managing sales, orders and real-time inventory.</p>

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
                <strong>Instant Catalog Access</strong>
                <small>Browse inventory, place purchase orders &amp; track shipments.</small>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <strong>Live Order Updates</strong>
                <small>Get real-time tracking from dispatch to delivery.</small>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <strong>Enterprise Security</strong>
                <small>Full JWT encryption with role-based access control.</small>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-hero-footer">
          <span>&copy; {new Date().getFullYear()} Smart Sales Platform Inc.</span>
          <span>Enterprise Cloud Suite</span>
        </div>
      </div>

      {/* Right Section: Registration Card */}
      <div className="auth-split-form">
        <div className="auth-form-card">
          <div className="auth-header">
            <div className="auth-badge" title="Sales Platform">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <h1>Create Account</h1>
            <p>Get started with your customer profile today</p>
          </div>

          {formError && (
            <div className="alert alert-error" role="status" style={{ marginBottom: 16 }}>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-grid" style={{ marginBottom: 16 }}>
            <div className="field-group">
              <label htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                type="text"
                className="input"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                type="email"
                className="input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="reg-password">Password</label>
              <div className="password-input-wrap">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 42 }}
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

            <div className="field-group">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="primary-btn" style={{ width: "100%", marginTop: 4 }} disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="divider"><span>or register with</span></div>

          <div className="google-wrap">
            <GoogleLoginButton mode="register" />
          </div>

          <div className="auth-security-notice">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Verified 256-bit SSL encrypted authentication</span>
          </div>

          <p className="auth-footer" style={{ marginTop: 20 }}>
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </p>
        </div>

        {/* Small Home Button */}
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

export default GoogleRegister;
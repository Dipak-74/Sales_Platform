import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/authService";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser(form);
      const payload = response?.data || {};

      if (!payload.token) {
        throw new Error("Authentication token was not returned by the backend.");
      }

      login({
        token: payload.token,
        userId: payload.userId,
        role: payload.role || "CUSTOMER",
        name: payload.name || form.name,
        email: payload.email || form.email,
      });

      navigate("/customer/dashboard", { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge">S</div>
          <h1>Create account</h1>
          <p>Register to access your business workspace</p>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="name">Full name</label>
            <input id="name" className="input" type="text" name="name" value={form.name} placeholder="Your full name" onChange={handleChange} />
          </div>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" className="input" type="email" name="email" value={form.email} placeholder="name@example.com" onChange={handleChange} />
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" className="input" type="password" name="password" value={form.password} placeholder="Create a password" onChange={handleChange} />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        <div className="google-wrap">
          <GoogleLoginButton mode="register" />
        </div>

        <p className="auth-footer">
          Already have an account? <button type="button" onClick={() => navigate("/login")}>Login</button>
        </p>
      </div>
    </div>
  );
}

export default Register;

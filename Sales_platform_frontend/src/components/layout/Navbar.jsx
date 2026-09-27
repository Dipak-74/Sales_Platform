
import { Link } from "react-router-dom";
import LogoutButton from "../LogoutButton";
import { useAuth } from "../../context/AuthContext";

function Navbar({ title, userName = "User", onMenuClick }) {
  const { role } = useAuth();

  const profilePath =
    role === "CUSTOMER" ? "/customer/profile" : "/profile";

  const getRoleBadgeStyle = (r) => {
    switch (r) {
      case "ADMIN":
        return {
          background: "#eff6ff",
          color: "#1d4ed8",
          border: "1px solid #bfdbfe",
        };

      case "MANAGER":
        return {
          background: "#f0fdf4",
          color: "#15803d",
          border: "1px solid #bbf7d0",
        };

      case "EMPLOYEE":
        return {
          background: "#faf5ff",
          color: "#7e22ce",
          border: "1px solid #e9d5ff",
        };

      case "CUSTOMER":
      default:
        return {
          background: "#f8fafc",
          color: "#475569",
          border: "1px solid #e2e8f0",
        };
    }
  };

  return (
    <header
      className="topbar"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Left Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <button
          type="button"
          className="menu-toggle"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <div>
          <p
            className="eyebrow"
            style={{
              color: "var(--text-muted)",
              fontSize: "0.72rem",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 700,
            }}
          >
            Enterprise Workspace
          </p>

          <h2
            style={{
              margin: "2px 0 0",
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "var(--text-main)",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* Right Section */}
      <div
        className="topbar-actions"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* System Status */}
        <div
          className="desktop-only"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 9999,
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            fontSize: "0.74rem",
            color: "#166534",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />

          <span>System Online</span>
        </div>

        {/* User */}
        <div
          className="user-pill"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "4px 8px",
          }}
        >
          <span
            className="user-avatar"
            style={{
              width: 34,
              height: 34,
              fontSize: "0.85rem",
            }}
          >
            {String(userName || "U").charAt(0).toUpperCase()}
          </span>

          <div style={{ lineHeight: 1.2 }}>
            <strong
              style={{
                fontSize: "0.86rem",
                color: "var(--text-main)",
                display: "block",
              }}
            >
              {userName}
            </strong>

            <span
              style={{
                display: "inline-block",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: "0.65rem",
                fontWeight: 700,
                marginTop: 2,
                ...getRoleBadgeStyle(role),
              }}
            >
              {role || "USER"}
            </span>
          </div>
        </div>

        {/* Profile */}
        <Link
          className="nav-link"
          to={profilePath}
          style={{
            fontSize: "0.84rem",
            fontWeight: 600,
            padding: "7px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "#ffffff",
          }}
        >
          Profile
        </Link>

        {/* Logout */}
        <LogoutButton />
      </div>
    </header>
  );
}

export default Navbar;

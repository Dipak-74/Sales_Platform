import { Link } from "react-router-dom";
import LogoutButton from "../LogoutButton";
import { useAuth } from "../../context/AuthContext";

function Navbar({ title, userName = "User", onMenuClick }) {
  const { role } = useAuth();
  const profilePath = role === "CUSTOMER" ? "/customer/profile" : "/profile";

  return (
    <header className="topbar" role="navigation" aria-label="Main navigation">
      <button type="button" className="menu-toggle" onClick={onMenuClick} aria-label="Toggle navigation">
        <span />
        <span />
        <span />
      </button>
      <div>
        <p className="eyebrow">Workspace</p>
        <h2>{title}</h2>
      </div>

      <div className="topbar-actions">
        <div className="user-pill">
          <span className="user-avatar">{String(userName || "U").charAt(0).toUpperCase()}</span>
          <div>
            <strong>{userName}</strong>
            <small>{role || "USER"}</small>
          </div>
        </div>
        <Link className="nav-link" to={profilePath}>Profile</Link>
        <LogoutButton />
      </div>
    </header>
  );
}

export default Navbar;

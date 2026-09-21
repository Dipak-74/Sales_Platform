import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";

function Profile() {
  const { role, userName, email } = useAuth();

  return (
    <MainLayout title="Profile" breadcrumb={["Profile"]} userName={userName || "User"}>
      <div className="card-grid single-col">
        <div className="panel-card">
          <div className="profile-header">
            <div className="profile-avatar">{String(userName || "U").charAt(0).toUpperCase()}</div>
            <div>
              <h3>{userName || "User"}</h3>
              <p>{role || "CUSTOMER"}</p>
            </div>
          </div>

          <div className="info-list">
            <div><span>Name</span><strong>{userName || "User"}</strong></div>
            <div><span>Email</span><strong>{email || "Not available"}</strong></div>
            <div><span>Role</span><strong>{role || "CUSTOMER"}</strong></div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;

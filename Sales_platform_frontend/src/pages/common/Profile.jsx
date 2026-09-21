import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";

function Profile() {
  const { role, userName, userEmail, email, userId } = useAuth();

  return (
    <MainLayout
      title="User Profile"
      breadcrumb={["Profile"]}
      userName={userName || "User"}
    >
      <div className="card-grid single-col" style={{ maxWidth: 600 }}>
        <div className="panel-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {String(userName || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: "0 0 4px 0" }}>{userName || "User"}</h3>
              <span className="badge badge-success">{role || "CUSTOMER"}</span>
            </div>
          </div>

          <div className="info-list" style={{ marginTop: 20 }}>
            <div>
              <span>User ID</span>
              <strong>#{userId || "-"}</strong>
            </div>
            <div>
              <span>Full Name</span>
              <strong>{userName || "User"}</strong>
            </div>
            <div>
              <span>Email Address</span>
              <strong>{userEmail || email || "Not available"}</strong>
            </div>
            <div>
              <span>Assigned Role</span>
              <strong>{role || "CUSTOMER"}</strong>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;


import ProtectedRoute from "../../routes/ProtectedRoute";
import MainLayout from "./MainLayout";

function ProtectedLayout({ children, ...layoutProps }) {
  return <ProtectedRoute><MainLayout {...layoutProps}>{children}</MainLayout></ProtectedRoute>;
}

export default ProtectedLayout;

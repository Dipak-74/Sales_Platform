import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { googleLogin, googleRegister } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function GoogleLoginButton({ mode = "login" }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = mode === "register"
        ? await googleRegister(credentialResponse?.credential)
        : await googleLogin(credentialResponse?.credential);

      const payload = response?.data || {};
      const { token, role, userId, name, email } = payload;

      if (!token) {
        throw new Error("Authentication token was not returned by the backend.");
      }

      login({ token, role: role || "CUSTOMER", userId, name: name || email || "User", email: email || "" });

      const redirectMap = {
        ADMIN: "/admin/dashboard",
        MANAGER: "/manager/dashboard",
        EMPLOYEE: "/employee/dashboard",
        CUSTOMER: "/customer/dashboard",
      };

      navigate(redirectMap[role] || "/customer/dashboard");
    } catch (error) {
      const message = mode === "register"
        ? "Google registration failed. Please try again."
        : "Google login failed. Please try again.";

      window.alert(message);
      console.error("Google auth error:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => window.alert("Google authentication was not completed.")}
      text="continue_with"
      shape="rectangular"
      size="large"
      width="300"
    />
  );
}

export default GoogleLoginButton;
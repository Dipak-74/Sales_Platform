import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const readStoredAuth = () => ({
  token: localStorage.getItem("token") || "",
  userId: localStorage.getItem("userId") || "",
  role: localStorage.getItem("role") || "",
  userName: localStorage.getItem("userName") || "User",
  email: localStorage.getItem("userEmail") || "",
  userEmail: localStorage.getItem("userEmail") || "",
});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  const login = (userData = {}) => {
    const nextAuth = {
      token: userData.token || "",
      userId: userData.userId || userData.id || "",
      role: userData.role || "CUSTOMER",
      userName: userData.name || userData.userName || "User",
      email: userData.email || userData.userEmail || "",
      userEmail: userData.email || userData.userEmail || "",
    };

    if (nextAuth.token) {
      localStorage.setItem("token", nextAuth.token);
    }
    if (nextAuth.userId) {
      localStorage.setItem("userId", String(nextAuth.userId));
    }
    if (nextAuth.role) {
      localStorage.setItem("role", nextAuth.role);
    }
    if (nextAuth.userName) {
      localStorage.setItem("userName", nextAuth.userName);
    }
    if (nextAuth.email) {
      localStorage.setItem("userEmail", nextAuth.email);
    }

    setAuth(nextAuth);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    setAuth({
      token: "",
      userId: "",
      role: "",
      userName: "User",
      email: "",
      userEmail: "",
    });
  };

  const restoreSession = () => setAuth(readStoredAuth());

  const value = useMemo(
    () => ({
      ...auth,
      isAuthenticated: Boolean(auth.token),
      login,
      logout,
      restoreSession,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

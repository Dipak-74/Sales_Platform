import api from "./api";

export const googleLogin = (idToken) =>
  api.post("/api/auth/google", { idToken });

export const googleRegister = (idToken) =>
  api.post("/api/auth/google/register", { idToken });

import api from "./api";

export const googleLogin = (idToken) =>
  api.post("/api/auth/google", { idToken });

export const googleRegister = (idToken) =>
  api.post("/api/auth/google/register", { idToken });

export const normalLogin = (email, password) =>
  api.post("/api/auth/login", { email, password });

export const normalRegister = (name, email, password) =>
  api.post("/api/auth/register", { name, email, password });

export const pingServer = () =>
  api.get("/api/auth/ping");

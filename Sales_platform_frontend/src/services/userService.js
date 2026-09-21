import api from "./api";

export const createUser = (data) =>
  api.post("/api/admin/users", data);

export const getUserById = (id) =>
  api.get(`/api/admin/users/${id}`);

export const getUserByEmail = (email) =>
  api.get("/api/admin/users/email", { params: { email } });

export const getUserByGoogleId = (googleId) =>
  api.get("/api/admin/users/google-id", { params: { googleId } });

export const getUsersByRole = (role) =>
  api.get(`/api/admin/users/role/${role}`);

export const getUsersByStatus = (status) =>
  api.get("/api/admin/users/status", { params: { status } });

export const getUsersCreatedBy = (adminId) =>
  api.get(`/api/admin/users/created-by/${adminId}`);

export const updateUserStatus = (id, status) =>
  api.put(`/api/admin/users/${id}/status`, null, { params: { status } });


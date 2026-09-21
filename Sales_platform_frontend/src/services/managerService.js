import api from "./api";

export const getManagers = () =>
  api.get("/api/admin/users/role/MANAGER");

export const getManagerById = (id) =>
  api.get(`/api/admin/users/${id}`);

export const createManager = (data) =>
  api.post("/api/admin/users", {
    ...data,
    role: "MANAGER",
    status: data.status || "ACTIVE",
  });

export const updateManagerStatus = (id, status) =>
  api.put(`/api/admin/users/${id}/status`, null, { params: { status } });
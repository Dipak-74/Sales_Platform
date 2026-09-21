import api from "./api";

// General departments list (accessible to authenticated staff)
export const getDepartments = () =>
  api.get("/api/departments");

// Admin department operations
export const getAllAdminDepartments = () =>
  api.get("/api/admin/departments");

export const getDepartmentById = (id) =>
  api.get(`/api/admin/departments/${id}`);

export const createDepartment = (data) =>
  api.post("/api/admin/departments", data);

export const updateDepartment = (id, data) =>
  api.put(`/api/admin/departments/${id}`, data);

export const updateDepartmentStatus = (id, status) =>
  api.put(`/api/admin/departments/${id}/status`, null, {
    params: { status },
  });

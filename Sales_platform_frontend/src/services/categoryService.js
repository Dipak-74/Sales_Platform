import api from "./api";

export const getCategories = () =>
  api.get("/api/categories");

export const getCategoryById = (id) =>
  api.get(`/api/categories/${id}`);

export const createCategory = (data) =>
  api.post("/api/admin/categories", data);

export const updateCategory = (id, data) =>
  api.put(`/api/admin/categories/${id}`, data);

export const updateCategoryStatus = (id, status) =>
  api.put(`/api/admin/categories/${id}/status`, null, {
    params: { status },
  });

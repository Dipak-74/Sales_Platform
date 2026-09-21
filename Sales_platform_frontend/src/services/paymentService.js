import api from "./api";

export const createPayment = (data) =>
  api.post("/api/payments", data);

export const getPaymentById = (id) =>
  api.get(`/api/payments/${id}`);

export const getPaymentByOrder = (orderId) =>
  api.get(`/api/payments/order/${orderId}`);

export const verifyPayment = (id) =>
  api.put(`/api/payments/${id}/verify`);

export const getPaymentsByStatus = (status) =>
  api.get("/api/payments/status", { params: { status } });

export const updatePaymentStatus = (id, status) =>
  api.put(`/api/payments/${id}/status`, null, {
    params: { status },
  });

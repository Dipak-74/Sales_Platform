import api from "./api";

export const getTransactionsByProduct = (productId) =>
  api.get(`/api/inventory/transactions/product/${productId}`);

export const getTransactionsByUser = (userId) =>
  api.get(`/api/inventory/transactions/user/${userId}`);

export const getTransactionsByType = (transactionType) =>
  api.get("/api/inventory/transactions/type", {
    params: { transactionType },
  });


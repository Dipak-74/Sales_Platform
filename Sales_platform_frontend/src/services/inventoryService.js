import api from "./api";

export const getInventory = () =>
  api.get("/api/inventory");

export const getInventoryByProduct = (productId) =>
  api.get(`/api/inventory/product/${productId}`);

export const getLowStockProducts = () =>
  api.get("/api/inventory/low-stock");

export const addStock = (data) =>
  api.post("/api/inventory/stock/add", data);

export const removeStock = (data) =>
  api.post("/api/inventory/stock/remove", data);

export const adjustStock = (data) =>
  api.post("/api/inventory/stock/adjust", data);

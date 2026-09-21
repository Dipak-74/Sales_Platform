import api from "./api";

export const getSalesReport = () => api.get("/reports/sales");
export const getProductReport = () => api.get("/reports/products");
export const getCustomerReport = () => api.get("/reports/customers");
export const getInventoryReport = () => api.get("/reports/inventory");
export const getPaymentReport = () => api.get("/reports/payments");

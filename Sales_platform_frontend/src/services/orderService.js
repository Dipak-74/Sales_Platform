import api from "./api";

export const getAllOrders = () =>
  api.get("/api/orders");

export const getOrders = () => getAllOrders();

export const getOrderById = (id) =>
  api.get(`/api/orders/${id}`);

export const getOrderByNumber = (orderNumber) =>
  api.get("/api/orders/number", { params: { orderNumber } });

export const getCustomerOrders = (customerId) =>
  api.get(`/api/orders/customer/${customerId}`);

export const getEmployeeOrders = (employeeId) =>
  api.get(`/api/orders/employee/${employeeId}`);

export const getOrdersByStatus = (status) =>
  api.get("/api/orders/status", { params: { status } });

export const createOrder = (data) =>
  api.post("/api/orders", data);

export const updateOrderStatus = (id, status) =>
  api.put(`/api/orders/${id}/status`, null, {
    params: { status },
  });

export const cancelOrder = (id) =>
  api.put(`/api/orders/${id}/cancel`);

export const getOrderItems = (orderId) =>
  api.get(`/api/orders/${orderId}/items`);

export const getOrderItemsByProduct = (productId) =>
  api.get(`/api/orders/items/product/${productId}`);

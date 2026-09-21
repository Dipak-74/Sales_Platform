import api from "./api";

const getRoleScope = () => {
  const role = localStorage.getItem("role");
  return role === "EMPLOYEE" ? "/api/employee" : "/api/manager";
};

// Staff operations (Manager & Employee)
export const getCustomers = () =>
  api.get(`${getRoleScope()}/customers`);

export const getCustomerById = (id) =>
  api.get(`${getRoleScope()}/customers/${id}`);

export const getCustomerByUserId = (userId) =>
  api.get(`${getRoleScope()}/customers/user/${userId}`);

export const searchCustomers = (name) =>
  api.get(`${getRoleScope()}/customers/search`, { params: { name } });

export const getCustomersByPhone = (phone) =>
  api.get(`${getRoleScope()}/customers/phone`, { params: { phone } });

export const getCustomersByStatus = (status) =>
  api.get(`${getRoleScope()}/customers/status`, { params: { status } });

// Manager-only write operations
export const createCustomer = (data) =>
  api.post("/api/manager/customers", data);

export const updateCustomer = (id, data) =>
  api.put("/api/manager/customers/" + id, data);

export const updateCustomerStatus = (id, status) =>
  api.put(`/api/manager/customers/${id}/status`, null, {
    params: { status },
  });

// Customer-scoped profile operations
export const getCustomerProfile = (userId) =>
  api.get(`/api/customer/profile/user/${userId}`);

export const getCustomerProfileById = (id) =>
  api.get(`/api/customer/profile/${id}`);

export const updateCustomerProfile = (id, data) =>
  api.put(`/api/customer/profile/${id}`, data);

export { getCustomerAddresses } from "./customerAddressService";


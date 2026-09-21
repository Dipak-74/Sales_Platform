import api from "./api";

export const getCustomerAddresses = (customerId) =>
  api.get(`/api/customer/addresses/customer/${customerId}`);

export const getAddressById = (id) =>
  api.get(`/api/customer/addresses/${id}`);

export const addAddress = (data) =>
  api.post("/api/customer/addresses", data);

export const updateAddress = (id, data) =>
  api.put(`/api/customer/addresses/${id}`, data);

export const deleteAddress = (id) =>
  api.delete(`/api/customer/addresses/${id}`);

export const setDefaultAddress = (id) =>
  api.put(`/api/customer/addresses/${id}/default`);


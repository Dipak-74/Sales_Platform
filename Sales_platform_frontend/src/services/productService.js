import api from "./api";

export const getProducts = () =>
  api.get("/api/products");

export const getProductById = (id) =>
  api.get(`/api/products/${id}`);

export const getProductBySku = (sku) =>
  api.get("/api/products/sku", { params: { sku } });

export const getProductsByCategory = (categoryId) =>
  api.get(`/api/products/category/${categoryId}`);

export const getProductsByStatus = (status) =>
  api.get("/api/products/status", { params: { status } });

export const searchProducts = (name) =>
  api.get("/api/products/search", { params: { name } });

export const filterProducts = (categoryId, status) =>
  api.get("/api/products/filter", {
    params: { categoryId, status },
  });


// =====================================================
// CREATE PRODUCT
// React → Supabase → imageUrl → Spring Boot
// =====================================================

export const createProduct = (product) =>
  api.post("/api/products", product);


// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateProduct = (id, product) =>
  api.put(`/api/products/${id}`, product);


// =====================================================
// UPDATE PRODUCT STATUS
// =====================================================

export const updateProductStatus = (id, status) =>
  api.put(`/api/products/${id}/status`, null, {
    params: { status },
  });
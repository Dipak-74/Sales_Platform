export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");

export const isValidPositiveNumber = (value) => Number(value) >= 0;

export const isValidPrice = (price) => Number(price) >= 0;

export const isValidQuantity = (quantity) => Number(quantity) >= 0;

export const isRequired = (value) => String(value ?? "").trim().length > 0;

export const validateProductForm = (product) => {
  const errors = {};

  if (!isRequired(product.name)) errors.name = "Product name is required.";
  if (!isRequired(product.sku)) errors.sku = "SKU is required.";
  if (!isValidPrice(product.costPrice)) errors.costPrice = "Cost price cannot be negative.";
  if (!isValidPrice(product.sellingPrice)) errors.sellingPrice = "Selling price cannot be negative.";

  if (product.categoryId === undefined || product.categoryId === "") {
    errors.categoryId = "Please select a category.";
  }

  return errors;
};

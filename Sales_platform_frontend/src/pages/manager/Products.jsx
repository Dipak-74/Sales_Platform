import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import ProductTable from "../../components/product/ProductTable";
import ProductForm from "../../components/product/ProductForm";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  updateProductStatus,
} from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { uploadProductImage } from "../../services/storageService";

function ManagerProducts() {
  const { userName, role } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const searchTimer = useRef(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProducts();
      setProducts(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(Array.isArray(response?.data) ? response.data : []);
    } catch {
      // categories optional
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedCategory("");

    if (searchTimer.current) clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(async () => {
      if (!value.trim()) {
        loadProducts();
        return;
      }
      try {
        setLoading(true);
        const res = await searchProducts(value.trim());
        setProducts(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Search failed.");
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleCategoryChange = async (e) => {
    const catId = e.target.value;
    setSelectedCategory(catId);
    setSearchTerm("");

    if (!catId) {
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      const res = await getProductsByCategory(catId);
      setProducts(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Category filter failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await updateProductStatus(id, newStatus);
      setSuccessMsg(`Status updated to ${newStatus}.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadProducts();
    } catch (err) {
      setError(err?.response?.data?.message || "Status update failed.");
    }
  };

  const handleFormSubmit = async (productData, imageFile) => {
    try {
      setFormSubmitting(true);
      setError("");

      if (editingProduct) {
        const id = editingProduct.id ?? editingProduct.productId;
        await updateProduct(id, productData);
        setSuccessMsg("Product updated successfully.");
      } else {
        const imageUrl = imageFile
          ? await uploadProductImage(imageFile)
          : productData.imageUrl;
        await createProduct({ ...productData, imageUrl }, null);
        setSuccessMsg("Product created successfully.");
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadProducts();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save product.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const displayedProducts = selectedStatus
    ? products.filter((p) => p.status === selectedStatus)
    : products;

  return (
    <MainLayout title="Products" breadcrumb={["Dashboard", "Products"]} userName={userName || "Manager"}>
      <div className="panel-card" style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h3 style={{ margin: 0 }}>Product Catalog</h3>
            <small style={{ color: "var(--text-muted)" }}>Manager product catalog operations</small>
          </div>

          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
          >
            + Add Product
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <input
            type="text"
            className="input"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <select className="select" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.categoryId ?? cat.id} value={cat.categoryId ?? cat.id}>{cat.name}</option>
            ))}
          </select>

          <select className="select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading products..." />
        ) : (
          <ProductTable
            products={displayedProducts}
            onEdit={(product) => {
              setEditingProduct(product);
              setIsModalOpen(true);
            }}
            onToggleStatus={handleToggleStatus}
            userRole={role || "MANAGER"}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? "Edit Product" : "Create Product"}
        maxWidth="680px"
      >
        <ProductForm
          initialData={editingProduct}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          loading={formSubmitting}
        />
      </Modal>
    </MainLayout>
  );
}

export default ManagerProducts;

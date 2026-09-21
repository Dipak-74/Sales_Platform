
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

import {
  getCategories,
  createCategory,
} from "../../services/categoryService";

import { uploadProductImage } from "../../services/storageService";


function AdminProducts() {

  const { userName, role } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const searchTimer = useRef(null);


  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const loadProducts = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const response = await getProducts();

      setProducts(
        Array.isArray(response?.data)
          ? response.data
          : []
      );

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        "Failed to load products."
      );

    } finally {

      setLoading(false);

    }

  }, []);


  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  const loadCategories = async () => {

    try {

      const response = await getCategories();

      setCategories(
        Array.isArray(response?.data)
          ? response.data
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load categories:",
        err
      );

    }

  };


  useEffect(() => {

    loadProducts();
    loadCategories();

  }, [loadProducts]);


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearchChange = (e) => {

    const value = e.target.value;

    setSearchTerm(value);
    setSelectedCategory("");

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(
      async () => {

        if (!value.trim()) {

          loadProducts();
          return;

        }

        try {

          setLoading(true);
          setError("");

          const response =
            await searchProducts(value.trim());

          setProducts(
            Array.isArray(response?.data)
              ? response.data
              : []
          );

        } catch (err) {

          setError(
            err?.response?.data?.message ||
            "Search failed."
          );

        } finally {

          setLoading(false);

        }

      },
      400
    );

  };


  // =====================================================
  // CATEGORY FILTER
  // =====================================================

  const handleCategoryChange = async (e) => {

    const categoryId = e.target.value;

    setSelectedCategory(categoryId);
    setSearchTerm("");

    if (!categoryId) {

      loadProducts();
      return;

    }

    try {

      setLoading(true);
      setError("");

      const response =
        await getProductsByCategory(categoryId);

      setProducts(
        Array.isArray(response?.data)
          ? response.data
          : []
      );

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        "Category filter failed."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // UPDATE PRODUCT STATUS
  // =====================================================

  const handleToggleStatus = async (
    id,
    newStatus
  ) => {

    try {

      setError("");

      await updateProductStatus(
        id,
        newStatus
      );

      setSuccessMsg(
        `Product status updated to ${newStatus}.`
      );

      setTimeout(
        () => setSuccessMsg(""),
        3000
      );

      await loadProducts();

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        "Failed to update product status."
      );

    }

  };


  // =====================================================
  // CREATE / UPDATE PRODUCT
  // =====================================================

  const handleFormSubmit = async (
    productData,
    imageFile
  ) => {

    try {

      setFormSubmitting(true);
      setError("");

      // -------------------------------------------------
      // UPDATE PRODUCT
      // -------------------------------------------------

      if (editingProduct) {

        const productId =
          editingProduct.id ??
          editingProduct.productId;

        await updateProduct(
          productId,
          productData
        );

        setSuccessMsg(
          "Product updated successfully."
        );

      }

      // -------------------------------------------------
      // CREATE PRODUCT
      // -------------------------------------------------

      else {

        let imageUrl =
          productData.imageUrl || null;

        // Upload image to Supabase
        if (imageFile) {

          imageUrl =
            await uploadProductImage(
              imageFile
            );

          console.log(
            "Selected Image:",
            imageFile
          );

          console.log(
            "Product Image URL:",
            imageUrl
          );
        }

        // Product data + image URL
        const product = {
          ...productData,
          imageUrl: imageUrl,
        };

        console.log(
          "Product Data Sent to Backend:",
          product
        );

        // Send JSON to Spring Boot
        await createProduct(product);

        setSuccessMsg(
          "Product created successfully."
        );

      }


      // -------------------------------------------------
      // CLOSE MODAL
      // -------------------------------------------------

      setIsModalOpen(false);
      setEditingProduct(null);

      setTimeout(
        () => setSuccessMsg(""),
        3000
      );

      await loadProducts();

    } catch (err) {

      console.error(
        "Product operation failed:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Operation failed. Please try again."
      );

    } finally {

      setFormSubmitting(false);

    }

  };


  // =====================================================
  // CREATE CATEGORY
  // =====================================================

  const handleCreateCategory = async (data) => {

    try {

      const response =
        await createCategory(data);

      const createdCategory =
        response?.data;

      await loadCategories();

      setSuccessMsg(
        "Category created successfully."
      );

      return createdCategory;

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        "Failed to create category."
      );

      throw err;

    }

  };


  // =====================================================
  // STATUS FILTER
  // =====================================================

  const displayedProducts =
    selectedStatus
      ? products.filter(
          (product) =>
            product.status === selectedStatus
        )
      : products;


  // =====================================================
  // UI
  // =====================================================

  return (

    <MainLayout
      title="Products"
      breadcrumb={[
        "Dashboard",
        "Products",
      ]}
      userName={
        userName || "Admin"
      }
    >

      <div
        className="panel-card"
        style={{
          display: "grid",
          gap: 18,
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
          }}
        >

          <div>

            <h3 style={{ margin: 0 }}>
              Product Management
            </h3>

            <small
              style={{
                color: "var(--text-muted)",
              }}
            >
              Browse, search, and manage products
            </small>

          </div>


          <button
            type="button"
            className="primary-btn"
            onClick={() => {

              setEditingProduct(null);
              setIsModalOpen(true);

            }}
          >
            + Add New Product
          </button>

        </div>


        {/* SEARCH / FILTER */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >

          <input
            type="text"
            className="input"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={handleSearchChange}
          />


          <select
            className="select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >

            <option value="">
              All Categories
            </option>

            {categories.map((category) => (

              <option
                key={
                  category.categoryId ??
                  category.id
                }
                value={
                  category.categoryId ??
                  category.id
                }
              >
                {category.name}
              </option>

            ))}

          </select>


          <select
            className="select"
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(
                e.target.value
              )
            }
          >

            <option value="">
              All Statuses
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>

          </select>

        </div>


        {/* MESSAGES */}

        {successMsg && (

          <div className="alert alert-success">
            {successMsg}
          </div>

        )}

        {error && (
          <ErrorMessage
            message={error}
          />
        )}


        {/* PRODUCT TABLE */}

        {loading ? (

          <Loader
            text="Loading products..."
          />

        ) : (

          <ProductTable
            products={displayedProducts}

            onEdit={(product) => {

              setEditingProduct(product);
              setIsModalOpen(true);

            }}

            onToggleStatus={
              handleToggleStatus
            }

            userRole={
              role || "ADMIN"
            }
          />

        )}

      </div>


      {/* PRODUCT MODAL */}

      <Modal
        isOpen={isModalOpen}

        onClose={() => {

          setIsModalOpen(false);
          setEditingProduct(null);

        }}

        title={
          editingProduct
            ? "Edit Product"
            : "Create New Product"
        }

        maxWidth="680px"
      >

        <ProductForm
          initialData={
            editingProduct
          }

          categories={
            categories
          }

          onSubmit={
            handleFormSubmit
          }

          onCreateCategory={
            handleCreateCategory
          }

          onCancel={() => {

            setIsModalOpen(false);
            setEditingProduct(null);

          }}

          loading={
            formSubmitting
          }
        />

      </Modal>

    </MainLayout>

  );

}


export default AdminProducts;

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import ProductTable from "../../components/product/ProductTable";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getProducts, searchProducts, getProductsByCategory } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

function EmployeeProducts() {
  const { userName } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const searchTimer = useRef(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getProducts();
      setProducts(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(Array.isArray(res?.data) ? res.data : []);
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

  return (
    <MainLayout title="Products" breadcrumb={["Dashboard", "Products"]} userName={userName || "Employee"}>
      <div className="panel-card" style={{ display: "grid", gap: 18 }}>
        <div>
          <h3 style={{ margin: 0 }}>Product Catalog Lookup</h3>
          <small style={{ color: "var(--text-muted)" }}>Search and inspect active product specifications and pricing</small>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
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
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading catalog..." />
        ) : (
          <ProductTable products={products} userRole="EMPLOYEE" />
        )}
      </div>
    </MainLayout>
  );
}

export default EmployeeProducts;

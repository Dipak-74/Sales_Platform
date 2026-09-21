import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import ProductCard from "../../components/product/ProductCard";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getProducts, searchProducts, getProductsByCategory } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

function CustomerProducts() {
  const { userName } = useAuth();
  const { addItem, count } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMsg, setToastMsg] = useState("");

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

  const handleAddToCart = (product) => {
    addItem(product);
    setToastMsg(`"${product.name}" added to cart!`);
    setTimeout(() => setToastMsg(""), 3000);
  };

  return (
    <MainLayout title="Products" breadcrumb={["Dashboard", "Products"]} userName={userName || "Customer"}>
      <div style={{ display: "grid", gap: 20 }}>
        <div className="panel-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h3 style={{ margin: 0 }}>Product Catalog</h3>
            <small style={{ color: "var(--text-muted)" }}>Explore our latest stock and order online</small>
          </div>

          <Link to="/customer/cart" className="primary-btn">
            🛒 View Cart ({count})
          </Link>
        </div>

        {/* Filter Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <input
            type="text"
            className="input"
            placeholder="Search products..."
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

        {toastMsg && <div className="alert alert-success">{toastMsg}</div>}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading catalog..." />
        ) : !products.length ? (
          <div className="empty-state">No products found matching your search.</div>
        ) : (
          <div className="card-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id ?? p.productId}
                product={p}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default CustomerProducts;

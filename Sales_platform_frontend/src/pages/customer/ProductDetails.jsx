import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getProductById } from "../../services/productService";
import { formatCurrency } from "../../utils/formatCurrency";

function CustomerProductDetails() {
  const { userName } = useAuth();
  const { addItem } = useCart();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProductById(id);
        if (!ignore) {
          setProduct(res?.data || null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.response?.data?.message || "Product not found.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setToastMsg(`Added ${quantity} "${product.name}" to your cart!`);
    setTimeout(() => setToastMsg(""), 3000);
  };

  if (loading) {
    return (
      <MainLayout title="Product Details" breadcrumb={["Dashboard", "Products", "Details"]} userName={userName || "Customer"}>
        <Loader text="Loading product details..." />
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout title="Product Details" breadcrumb={["Dashboard", "Products", "Details"]} userName={userName || "Customer"}>
        <ErrorMessage message={error || "Product not found."} />
        <div style={{ marginTop: 14 }}>
          <Link to="/customer/products" className="secondary-btn">
            &larr; Back to Products
          </Link>
        </div>
      </MainLayout>
    );
  }

  const isAvailable = product.status !== "INACTIVE";

  return (
    <MainLayout title={product.name} breadcrumb={["Dashboard", "Products", product.name]} userName={userName || "Customer"}>
      <div style={{ display: "grid", gap: 20 }}>
        {toastMsg && <div className="alert alert-success">{toastMsg}</div>}

        <div className="panel-card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {/* Image */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-subtle)", borderRadius: 16, padding: 20, minHeight: 320 }}>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ maxHeight: 380, maxWidth: "100%", objectFit: "contain", borderRadius: 12 }}
              />
            ) : (
              <div style={{ fontSize: "5rem", opacity: 0.3 }}>📦</div>
            )}
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <small style={{ color: "var(--primary)", fontWeight: 700, textTransform: "uppercase" }}>
                  {product.category?.name || product.categoryName || "General"}
                </small>
                <span className={`badge ${isAvailable ? "badge-success" : "badge-danger"}`}>
                  {product.status || "ACTIVE"}
                </span>
              </div>

              <h2 style={{ margin: "0 0 10px", fontSize: "1.8rem" }}>{product.name}</h2>
              <div style={{ fontFamily: "monospace", color: "var(--text-muted)", marginBottom: 16 }}>
                SKU: {product.sku || "-"}
              </div>

              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 18 }}>
                {formatCurrency(product.sellingPrice ?? product.price)}
              </div>

              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {product.description || "No detailed description provided for this product."}
              </p>
            </div>

            <div style={{ display: "grid", gap: 14, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <label htmlFor="qtySelect" style={{ fontWeight: 600 }}>Quantity:</label>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <button
                    type="button"
                    className="secondary-btn"
                    style={{ padding: "6px 12px" }}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span style={{ minWidth: 32, textAlign: "center", fontWeight: 700 }}>{quantity}</span>
                  <button
                    type="button"
                    className="secondary-btn"
                    style={{ padding: "6px 12px" }}
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="primary-btn"
                  style={{ flex: 1, padding: "14px 24px" }}
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                >
                  🛒 Add to Cart
                </button>
                <Link to="/customer/cart" className="secondary-btn" style={{ padding: "14px 20px" }}>
                  Go to Cart
                </Link>
              </div>

              <Link to="/customer/products" style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: 6 }}>
                &larr; Return to Product Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default CustomerProductDetails;

import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";

function CustomerCart() {
  const { userName } = useAuth();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <MainLayout title="Shopping Cart" breadcrumb={["Dashboard", "Cart"]} userName={userName || "Customer"}>
      <div className="panel-card" style={{ display: "grid", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Review Your Cart ({items.length} item{items.length !== 1 ? "s" : ""})</h3>
          {items.length > 0 && (
            <button type="button" className="danger-btn" style={{ padding: "6px 12px", fontSize: "0.82rem" }} onClick={clearCart}>
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-state" style={{ padding: "48px 16px" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>🛒</div>
            <h4>Your shopping cart is empty</h4>
            <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>Explore our catalog and find items you love.</p>
            <Link to="/customer/products" className="primary-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {/* Cart Items List */}
            <div style={{ display: "grid", gap: 14 }}>
              {items.map((item) => {
                const productId = item.productId ?? item.id;
                const unitPrice = item.sellingPrice ?? item.price ?? 0;
                const lineTotal = unitPrice * (item.quantity ?? 1);

                return (
                  <div
                    key={productId}
                    className="panel-card"
                    style={{
                      padding: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10 }}
                        />
                      ) : (
                        <div style={{ width: 56, height: 56, borderRadius: 10, background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                          📦
                        </div>
                      )}
                      <div>
                        <strong>{item.name}</strong>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                          {formatCurrency(unitPrice)} each
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <button
                          type="button"
                          className="secondary-btn"
                          style={{ padding: "4px 10px", fontSize: "0.85rem" }}
                          onClick={() => updateQuantity(productId, -1)}
                        >
                          -
                        </button>
                        <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="secondary-btn"
                          style={{ padding: "4px 10px", fontSize: "0.85rem" }}
                          onClick={() => updateQuantity(productId, 1)}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ minWidth: 90, textAlign: "right", fontWeight: 800 }}>
                        {formatCurrency(lineTotal)}
                      </div>

                      <button
                        type="button"
                        className="danger-btn"
                        style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                        onClick={() => removeItem(productId)}
                        aria-label="Remove item"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div>
              <div className="panel-card" style={{ padding: 24, display: "grid", gap: 16 }}>
                <h4 style={{ margin: 0 }}>Order Summary</h4>

                <div className="info-list">
                  <div>
                    <span>Items Total ({items.length})</span>
                    <strong>{formatCurrency(subtotal)}</strong>
                  </div>
                  <div>
                    <span>Estimated Shipping</span>
                    <strong style={{ color: "var(--success)" }}>FREE</strong>
                  </div>
                  <div style={{ borderTop: "2px solid var(--border)", paddingTop: 12 }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: 700 }}>Total Due</span>
                    <strong style={{ fontSize: "1.3rem", color: "var(--primary)" }}>
                      {formatCurrency(subtotal)}
                    </strong>
                  </div>
                </div>

                <Link
                  to="/customer/checkout"
                  className="primary-btn"
                  style={{ textAlign: "center", padding: "14px", fontSize: "1rem" }}
                >
                  Proceed to Checkout &rarr;
                </Link>

                <Link
                  to="/customer/products"
                  style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}
                >
                  &larr; Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default CustomerCart;

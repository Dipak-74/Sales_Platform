import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

function ProductCard({ product, onAddToCart }) {
  const id = product.id ?? product.productId;
  const isAvailable = product.status !== "INACTIVE";

  return (
    <div className="panel-card product-card">
      <div className="product-card-img-wrap">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="product-card-img" />
        ) : (
          <div className="product-card-placeholder">📦</div>
        )}
        <span className={`badge product-badge ${isAvailable ? "badge-success" : "badge-danger"}`}>
          {product.status || "ACTIVE"}
        </span>
      </div>

      <div className="product-card-body">
        <small className="product-card-category">
          {product.category?.name || product.categoryName || "General"}
        </small>
        <h4 className="product-card-title" title={product.name}>
          {product.name}
        </h4>
        <p className="product-card-desc">
          {product.description ? product.description.slice(0, 75) + "..." : "No description available."}
        </p>

        <div className="product-card-price-row">
          <span className="product-card-price">
            {formatCurrency(product.sellingPrice ?? product.price)}
          </span>
          <span className="product-card-sku">SKU: {product.sku || "-"}</span>
        </div>

        <div className="product-card-actions">
          <Link to={`/customer/products/${id}`} className="secondary-btn" style={{ flex: 1, textAlign: "center" }}>
            Details
          </Link>
          {onAddToCart && (
            <button
              type="button"
              className="primary-btn"
              style={{ flex: 1.2 }}
              onClick={() => onAddToCart(product)}
              disabled={!isAvailable}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;


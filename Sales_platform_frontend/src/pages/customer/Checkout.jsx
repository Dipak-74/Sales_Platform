import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatters";
import { createOrder } from "../../services/orderService";
import { getCustomerProfile } from "../../services/customerService";
import { getCustomerAddresses } from "../../services/customerAddressService";

function CustomerCheckout() {
  const navigate = useNavigate();
  const { userName, userId } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [customerId, setCustomerId] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [form, setForm] = useState({
    address: "",
    paymentMethod: "UPI",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCustomerData = useCallback(async () => {
    if (!userId) return;
    try {
      // First resolve Customer entity by userId
      const profRes = await getCustomerProfile(userId);
      const customer = profRes?.data;
      if (customer) {
        const cId = customer.customerId ?? customer.id;
        setCustomerId(cId);

        // Fetch addresses for this customerId
        if (cId) {
          const addrRes = await getCustomerAddresses(cId);
          const list = Array.isArray(addrRes?.data) ? addrRes.data : [];
          setSavedAddresses(list);
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          if (defaultAddr) {
            setForm((prev) => ({
              ...prev,
              address: [
                defaultAddr.addressLine,
                defaultAddr.city,
                defaultAddr.state,
                defaultAddr.pincode,
              ]
                .filter(Boolean)
                .join(", "),
            }));
          }
        }
      }
    } catch {
      // If customer record is not yet linked, fall back to userId
      setCustomerId(Number(userId));
    }
  }, [userId]);

  useEffect(() => {
    loadCustomerData();
  }, [loadCustomerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectSavedAddress = (e) => {
    const val = e.target.value;
    if (val) {
      setForm((prev) => ({ ...prev, address: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!items.length) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!form.address.trim()) {
      setError("Delivery address is required.");
      return;
    }

    try {
      setLoading(true);

      const resolvedCustId = customerId || Number(userId);

      // Matches OrderCreateRequestDTO
      const payload = {
        customerId: resolvedCustId,
        discount: 0,
        tax: 0,
        items: items.map((item) => ({
          productId: Number(item.productId ?? item.id),
          quantity: Number(item.quantity ?? 1),
          discount: 0,
        })),
      };

      const response = await createOrder(payload);
      const order = response?.data || {};
      const orderId = order.orderId ?? order.id;

      clearCart();
      navigate(
        `/customer/payment?orderId=${orderId}&amount=${
          order.totalAmount || subtotal
        }`
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Order creation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <MainLayout
        title="Checkout"
        breadcrumb={["Dashboard", "Checkout"]}
        userName={userName || "Customer"}
      >
        <div
          className="panel-card"
          style={{ textAlign: "center", padding: "40px 16px" }}
        >
          <h3>Your cart is empty</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: 18 }}>
            Please select products to proceed with checkout.
          </p>
          <Link to="/customer/products" className="primary-btn">
            Browse Products
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Checkout"
      breadcrumb={["Dashboard", "Cart", "Checkout"]}
      userName={userName || "Customer"}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
        }}
      >
        {/* Checkout Form */}
        <div className="panel-card" style={{ display: "grid", gap: 18 }}>
          <h3 style={{ margin: 0 }}>Shipping & Delivery Details</h3>

          {error && <div className="alert alert-error">{error}</div>}

          <form className="form-grid" onSubmit={handleSubmit}>
            {savedAddresses.length > 0 && (
              <div className="field-group">
                <label htmlFor="savedAddrSelect">
                  Choose from Saved Addresses
                </label>
                <select
                  id="savedAddrSelect"
                  className="select"
                  onChange={handleSelectSavedAddress}
                >
                  <option value="">-- Choose an address or type below --</option>
                  {savedAddresses.map((addr, i) => {
                    const full = [
                      addr.addressLine,
                      addr.city,
                      addr.state,
                      addr.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ");
                    return (
                      <option key={addr.addressId ?? i} value={full}>
                        {addr.addressType || "Address"} - {full}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <div className="field-group">
              <label htmlFor="address">Delivery Address *</label>
              <textarea
                id="address"
                name="address"
                className="input"
                rows="4"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter complete shipping address, street, city, pin code"
                required
              />
            </div>

            <button
              type="submit"
              className="primary-btn"
              style={{ padding: "14px", fontSize: "1rem", marginTop: 8 }}
              disabled={loading}
            >
              {loading
                ? "Creating Order..."
                : `Confirm Order & Proceed to Pay ${formatCurrency(subtotal)}`}
            </button>
          </form>
        </div>

        {/* Order Review Side Card */}
        <div
          className="panel-card"
          style={{ display: "grid", gap: 16, height: "fit-content" }}
        >
          <h4 style={{ margin: 0 }}>Items Summary ({items.length})</h4>

          <div
            style={{
              display: "grid",
              gap: 10,
              maxHeight: 280,
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {items.map((item) => {
              const unitPrice = item.sellingPrice ?? item.price ?? 0;
              return (
                <div
                  key={item.productId ?? item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.9rem",
                    borderBottom: "1px solid var(--border-subtle)",
                    paddingBottom: 8,
                  }}
                >
                  <div>
                    <strong>{item.name}</strong>
                    <div style={{ color: "var(--text-muted)" }}>
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div>
                    {formatCurrency(unitPrice * (item.quantity ?? 1))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="info-list">
            <div>
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong style={{ color: "var(--success)" }}>FREE</strong>
            </div>
            <div
              style={{
                borderTop: "2px solid var(--border)",
                paddingTop: 10,
              }}
            >
              <span style={{ fontSize: "1.05rem", fontWeight: 700 }}>Total</span>
              <strong
                style={{ fontSize: "1.25rem", color: "var(--primary)" }}
              >
                {formatCurrency(subtotal)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default CustomerCheckout;

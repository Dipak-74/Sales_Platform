import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../context/AuthContext";
import {
  createPayment,
  getPaymentByOrder,
  verifyPayment,
} from "../../services/paymentService";
import { formatCurrency, getStatusBadgeClass } from "../../utils/formatters";
import { PAYMENT_METHODS } from "../../utils/constants";

function CustomerPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userName } = useAuth();

  const orderId = searchParams.get("orderId");
  const amount = Number(searchParams.get("amount") || 0);
  const returnedFromGateway = searchParams.get("return") === "1";

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!returnedFromGateway || !orderId) return;

    const verifyReturnedPayment = async () => {
      try {
        setLoading(true);
        const paymentResponse = await getPaymentByOrder(orderId);
        const paymentId = paymentResponse?.data?.paymentId;
        if (!paymentId) throw new Error("Payment record was not found.");
        const response = await verifyPayment(paymentId);
        setPaymentResult(response?.data || {});
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Payment verification is pending. Please try again shortly."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyReturnedPayment();
  }, [orderId, returnedFromGateway]);

  const handleProcessPayment = async () => {
    if (!orderId) {
      setError("Order reference is missing. Please checkout from your cart again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        orderId: Number(orderId),
        amount: amount,
        paymentMethod: paymentMethod,
      };

      const response = await createPayment(payload);
      const data = response?.data || {};
      if (!data.paymentSessionId) {
        throw new Error("Payment gateway session was not returned.");
      }

      const cashfree = await load({
        mode: import.meta.env.VITE_CASHFREE_MODE || "sandbox",
      });
      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Payment request failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      title="Order Payment"
      breadcrumb={["Dashboard", "Payment"]}
      userName={userName || "Customer"}
    >
      <div
        className="panel-card"
        style={{ maxWidth: 540, margin: "0 auto", display: "grid", gap: 20 }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.8rem", marginBottom: 8 }}>💳</div>
          <h3 style={{ margin: 0 }}>Payment Processing</h3>
          <small style={{ color: "var(--text-muted)" }}>
            Order Reference #{orderId || "N/A"}
          </small>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {paymentResult ? (
          <div style={{ textAlign: "center", display: "grid", gap: 16 }}>
            <div
              className={`alert ${
                paymentResult.paymentStatus === "SUCCESS"
                  ? "alert-success"
                  : "alert-warning"
              }`}
              style={{ justifyContent: "center" }}
            >
              {paymentResult.paymentStatus === "SUCCESS"
                ? "✅ Payment Confirmed by Backend"
                : `ℹ️ Payment Status: ${paymentResult.paymentStatus || "PENDING"}`}
            </div>

            <div className="info-list">
              <div>
                <span>Payment ID</span>
                <strong>#{paymentResult.paymentId || "-"}</strong>
              </div>
              <div>
                <span>Order Number</span>
                <strong>{paymentResult.orderNumber || `#${orderId}`}</strong>
              </div>
              <div>
                <span>Payment Method</span>
                <strong>{paymentResult.paymentMethod || paymentMethod}</strong>
              </div>
              <div>
                <span>Amount</span>
                <strong>{formatCurrency(paymentResult.amount || amount)}</strong>
              </div>
              <div>
                <span>Backend Status</span>
                <span
                  className={`badge ${getStatusBadgeClass(
                    paymentResult.paymentStatus
                  )}`}
                >
                  {paymentResult.paymentStatus || "PENDING"}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <button
                type="button"
                className="primary-btn"
                onClick={() => navigate("/customer/orders")}
              >
                View My Orders
              </button>
              <Link to="/customer/products" className="secondary-btn">
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 18 }}>
            <div className="info-list">
              <div>
                <span>Order Reference</span>
                <strong>#{orderId || "Not specified"}</strong>
              </div>
              <div>
                <span>Total Amount Due</span>
                <strong style={{ fontSize: "1.2rem", color: "var(--primary)" }}>
                  {formatCurrency(amount)}
                </strong>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="payMethod">Select Payment Method *</label>
              <select
                id="payMethod"
                className="select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="primary-btn"
              style={{ padding: "14px", fontSize: "1rem" }}
              onClick={handleProcessPayment}
              disabled={loading || !orderId}
            >
              {loading
                ? "Submitting Payment to Backend..."
                : `Submit Payment (${formatCurrency(amount)})`}
            </button>

            <Link
              to="/customer/cart"
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "0.88rem",
              }}
            >
              Cancel & Return to Cart
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default CustomerPayment;

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getPaymentsByStatus } from "../../services/paymentService";
import { formatCurrency } from "../../utils/formatCurrency";

const statuses = ["PENDING", "SUCCESS", "FAILED"];

function AdminPayments() {
  const { userName } = useAuth();
  const [status, setStatus] = useState("PENDING");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getPaymentsByStatus(status);
      setPayments(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  return (
    <MainLayout title="Payments" breadcrumb={["Dashboard", "Payments"]} userName={userName || "Admin"}>
      <div className="panel-card page-stack">
        <div className="page-heading-row">
          <div><p className="eyebrow">Transaction control</p><h3>Payment activity</h3><small>Gateway-backed payment records from the backend.</small></div>
          <select className="select compact-control" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Payment status">
            {statuses.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>
        {error && <ErrorMessage message={error} />}
        {loading ? <Loader text="Loading payments..." /> : !payments.length ? <div className="empty-state">No {status.toLowerCase()} payments found.</div> : (
          <div className="table-responsive"><table className="data-table"><thead><tr><th>Payment</th><th>Order</th><th>Amount</th><th>Method</th><th>Status</th><th>Paid at</th></tr></thead><tbody>
            {payments.map((payment) => <tr key={payment.paymentId}><td>#{payment.paymentId}</td><td>{payment.orderNumber || `#${payment.orderId}`}</td><td>{formatCurrency(payment.amount)}</td><td>{payment.paymentMethod || "-"}</td><td><span className={`badge badge-${String(payment.paymentStatus || status).toLowerCase()}`}>{payment.paymentStatus || status}</span></td><td>{payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "-"}</td></tr>)}
          </tbody></table></div>
        )}
      </div>
    </MainLayout>
  );
}

export default AdminPayments;

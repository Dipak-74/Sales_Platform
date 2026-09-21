import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import {
  getInventory,
  getLowStockProducts,
  adjustStock,
} from "../../services/inventoryService";
import { getTransactionsByUser } from "../../services/inventoryTransactionService";
import { formatDate } from "../../utils/formatters";

function ManagerInventory() {
  const { userName, userId } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("stock");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [reason, setReason] = useState("Routine Stock Adjustment");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [invRes, transRes] = await Promise.allSettled([
        getInventory(),
        userId ? getTransactionsByUser(userId) : Promise.resolve({ data: [] }),
      ]);

      if (invRes.status === "fulfilled") {
        setInventory(Array.isArray(invRes.value?.data) ? invRes.value.data : []);
      }
      if (transRes.status === "fulfilled") {
        setTransactions(
          Array.isArray(transRes.value?.data) ? transRes.value.data : []
        );
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setNewQuantity(item.quantity ?? 0);
    setReason("Stock adjustment");
    setIsEditOpen(true);
  };

  const handleSaveStock = async (e) => {
    e.preventDefault();
    if (!selectedItem || !userId) return;

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        productId: Number(selectedItem.productId),
        quantity: Number(newQuantity),
        reason: reason.trim() || "Stock adjustment",
      };

      await adjustStock(payload);
      setSuccessMsg("Inventory adjusted successfully.");
      setIsEditOpen(false);
      setTimeout(() => setSuccessMsg(""), 3500);
      loadData();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to adjust inventory."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterLowStock = async () => {
    try {
      setLoading(true);
      const res = await getLowStockProducts();
      setInventory(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to filter low stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      title="Inventory Control"
      breadcrumb={["Dashboard", "Inventory"]}
      userName={userName || "Manager"}
    >
      <div className="panel-card" style={{ display: "grid", gap: 18 }}>
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
            <h3 style={{ margin: 0 }}>Stock & Inventory Control</h3>
            <small style={{ color: "var(--text-muted)" }}>
              Monitor warehouse inventory and manage stock levels
            </small>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              className="secondary-btn"
              onClick={handleFilterLowStock}
            >
              ⚠️ Low Stock Only
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={loadData}
            >
              🔄 Refresh All
            </button>
            <div
              style={{
                display: "inline-flex",
                gap: 4,
                background: "var(--bg-subtle)",
                padding: 4,
                borderRadius: 10,
              }}
            >
              <button
                type="button"
                className={activeTab === "stock" ? "primary-btn" : "secondary-btn"}
                style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                onClick={() => setActiveTab("stock")}
              >
                Current Stock
              </button>
              <button
                type="button"
                className={activeTab === "transactions" ? "primary-btn" : "secondary-btn"}
                style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                onClick={() => setActiveTab("transactions")}
              >
                Movement Log
              </button>
            </div>
          </div>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading inventory records..." />
        ) : activeTab === "stock" ? (
          !inventory.length ? (
            <div className="empty-state">No inventory records found.</div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Available Quantity</th>
                    <th>Minimum Stock</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const id = item.inventoryId ?? item.productId;
                    const qty = item.quantity ?? 0;
                    const min = item.minimumStock ?? 5;
                    const isLow = item.lowStock || qty <= min;

                    return (
                      <tr key={id}>
                        <td>#{item.productId}</td>
                        <td>
                          <strong>{item.productName || `Product #${item.productId}`}</strong>
                        </td>
                        <td>
                          <strong>{qty}</strong> units
                        </td>
                        <td>{min} units</td>
                        <td>
                          <span
                            className={`badge ${
                              isLow ? "badge-danger" : "badge-success"
                            }`}
                          >
                            {isLow ? "LOW STOCK" : "IN STOCK"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="secondary-btn"
                            style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                            onClick={() => handleOpenEdit(item)}
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : !transactions.length ? (
          <div className="empty-state">No transaction logs available.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.transactionId}>
                    <td>#{t.transactionId}</td>
                    <td>{formatDate(t.createdAt)}</td>
                    <td>
                      <strong>
                        {t.productName || `Product #${t.productId}`}
                      </strong>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          t.transactionType === "IN"
                            ? "badge-success"
                            : t.transactionType === "OUT"
                            ? "badge-danger"
                            : "badge-warning"
                        }`}
                      >
                        {t.transactionType}
                      </span>
                    </td>
                    <td>{t.quantity}</td>
                    <td>{t.referenceType || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Adjust Stock Level"
      >
        <form className="form-grid" onSubmit={handleSaveStock}>
          <div className="field-group">
            <label>Product</label>
            <strong>
              {selectedItem?.productName || `Product #${selectedItem?.productId}`}
            </strong>
          </div>

          <div className="field-group">
            <label htmlFor="invQtyInput">New Total Quantity *</label>
            <input
              id="invQtyInput"
              type="number"
              min="0"
              className="input"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="invReasonInput">Reason / Note</label>
            <input
              id="invReasonInput"
              type="text"
              className="input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Audit correction, supplier arrival"
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 10,
            }}
          >
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Adjustment"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default ManagerInventory;


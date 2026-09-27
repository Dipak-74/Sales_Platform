import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatCard from "../../components/dashboard/StatCard";
import { formatDate } from "../../utils/formatters";
import {
  getInventory,
  addStock,
  removeStock,
} from "../../services/inventoryService";
import { getTransactionsByType } from "../../services/inventoryTransactionService";

function AdminInventory() {
  const { userName } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("stock"); // "stock" | "transactions"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit stock modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [invRes, transRes] = await Promise.allSettled([
        getInventory(),
        Promise.all(["IN", "OUT", "ADJUSTMENT"].map((type) => getTransactionsByType(type))),
      ]);

      if (invRes.status === "fulfilled") {
        setInventory(Array.isArray(invRes.value?.data) ? invRes.value.data : []);
      }
      if (transRes.status === "fulfilled") {
        setTransactions(transRes.value.flatMap((response) => Array.isArray(response?.data) ? response.data : []));
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load inventory data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setNewQuantity(item.quantity ?? 0);
    setIsEditOpen(true);
  };

  const handleSaveStock = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      setSubmitting(true);
      setError("");
      const productId = selectedItem.product?.id ?? selectedItem.productId;
      const currentQuantity = Number(selectedItem.quantity ?? 0);
      const targetQuantity = Number(newQuantity);
      const delta = targetQuantity - currentQuantity;

      if (!productId || targetQuantity < 0 || !Number.isInteger(targetQuantity)) {
        throw new Error("Enter a valid whole-number stock quantity.");
      }

      if (delta > 0) {
        await addStock({ productId, quantity: delta, reason: "ADMIN_ADJUSTMENT" });
      } else if (delta < 0) {
        await removeStock({ productId, quantity: Math.abs(delta), reason: "ADMIN_ADJUSTMENT" });
      }

      setSuccessMsg("Stock updated successfully.");
      setIsEditOpen(false);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update inventory.");
    } finally {
      setSubmitting(false);
    }
  };

  // Metrics
  const totalUnits = inventory.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const lowStockItems = inventory.filter((item) => {
    const qty = Number(item.quantity || 0);
    const min = Number(item.minimumStock ?? item.minStock ?? 5);
    return qty > 0 && qty <= min;
  }).length;
  const outOfStockItems = inventory.filter((item) => Number(item.quantity || 0) === 0).length;

  return (
    <MainLayout title="Inventory & Stock" breadcrumb={["Dashboard", "Inventory"]} userName={userName || "Admin"}>
      <div style={{ display: "grid", gap: 24 }}>
        {/* Inventory Metric Cards */}
        <div className="stats-grid">
          <StatCard
            label="Total Units in Stock"
            value={totalUnits.toLocaleString()}
            helper="Physical units across warehouse"
            variant="blue"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" y1="22" x2="12" y2="12" />
              </svg>
            }
          />
          <StatCard
            label="Low Stock Warnings"
            value={lowStockItems}
            helper="Products at or below reorder limit"
            variant={lowStockItems > 0 ? "amber" : "green"}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            }
          />
          <StatCard
            label="Out of Stock"
            value={outOfStockItems}
            helper="Items requiring urgent restock"
            variant={outOfStockItems > 0 ? "red" : "green"}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            }
          />
        </div>

        {/* Inventory Control Panel */}
        <div className="panel-card" style={{ display: "grid", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            <div>
              <h3 style={{ margin: 0 }}>Warehouse Inventory Controls</h3>
              <small style={{ color: "var(--text-muted)" }}>Stock levels, minimum thresholds and real-time transaction ledger</small>
            </div>

            <div style={{ display: "inline-flex", gap: 6, background: "var(--bg-subtle)", padding: 4, borderRadius: 10, border: "1px solid var(--border)" }}>
              <button
                type="button"
                className={activeTab === "stock" ? "primary-btn" : "secondary-btn"}
                style={{ padding: "6px 14px", fontSize: "0.82rem", borderRadius: 8 }}
                onClick={() => setActiveTab("stock")}
              >
                Stock Levels
              </button>
              <button
                type="button"
                className={activeTab === "transactions" ? "primary-btn" : "secondary-btn"}
                style={{ padding: "6px 14px", fontSize: "0.82rem", borderRadius: 8 }}
                onClick={() => setActiveTab("transactions")}
              >
                Audit Log ({transactions.length})
              </button>
            </div>
          </div>

          {successMsg && <div className="alert alert-success">{successMsg}</div>}
          {error && <ErrorMessage message={error} />}

          {loading ? (
            <Loader text="Loading warehouse inventory..." />
          ) : activeTab === "stock" ? (
            !inventory.length ? (
              <div className="empty-state">No inventory records found in warehouse.</div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Current Stock</th>
                      <th>Reorder Threshold</th>
                      <th>Stock Health</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => {
                      const id = item.id ?? item.inventoryId;
                      const qty = item.quantity ?? 0;
                      const min = item.minimumStock ?? item.minStock ?? 5;
                      const isLow = qty > 0 && qty <= min;
                      const isOut = qty === 0;

                      return (
                        <tr key={id}>
                          <td>
                            <strong style={{ color: "var(--text-main)", fontSize: "0.92rem" }}>
                              {item.product?.name || item.productName || `Product #${item.productId || id}`}
                            </strong>
                          </td>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                fontFamily: "monospace",
                                fontSize: "0.78rem",
                                background: "#f1f5f9",
                                padding: "2px 7px",
                                borderRadius: 4,
                                color: "#475569",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              {item.product?.sku || item.sku || "-"}
                            </span>
                          </td>
                          <td>
                            <strong style={{ fontSize: "1rem", color: isOut ? "#dc2626" : isLow ? "#d97706" : "var(--text-main)" }}>
                              {qty}
                            </strong>{" "}
                            <small style={{ color: "var(--text-muted)" }}>units</small>
                          </td>
                          <td style={{ color: "var(--text-secondary)" }}>
                            {min} units
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                isOut
                                  ? "badge-danger"
                                  : isLow
                                  ? "badge-warning"
                                  : "badge-success"
                              }`}
                            >
                              {isOut ? "OUT OF STOCK" : isLow ? "LOW STOCK" : "OPTIMAL"}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              className="secondary-btn"
                              style={{ padding: "4px 10px", fontSize: "0.78rem" }}
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
          ) : (
            !transactions.length ? (
              <div className="empty-state">No inventory transactions logged yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Product</th>
                      <th>Type</th>
                      <th>Quantity Change</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.id ?? t.transactionId}>
                        <td>#{t.id ?? t.transactionId}</td>
                        <td>{formatDate(t.createdAt || t.timestamp)}</td>
                        <td><strong>{t.product?.name || t.productName || `Product #${t.productId}`}</strong></td>
                        <td>
                          <span className={`badge ${t.type === "IN" || t.type === "RESTOCK" ? "badge-success" : "badge-warning"}`}>
                            {t.type || "UPDATE"}
                          </span>
                        </td>
                        <td>{t.quantity > 0 ? `+${t.quantity}` : t.quantity}</td>
                        <td>{t.note || t.reason || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>

      {/* Adjust Stock Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Adjust Inventory Level">
        <form className="form-grid" onSubmit={handleSaveStock}>
          <div className="field-group">
            <label>Target Product</label>
            <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", fontWeight: 600 }}>
              {selectedItem?.product?.name || selectedItem?.productName || "Product"}
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="invQty">Target Available Quantity (Units) *</label>
            <input
              id="invQty"
              type="number"
              min="0"
              className="input"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              required
            />
          </div>

          <small style={{ color: "var(--text-muted)" }}>
            The system will automatically calculate the inventory delta and write a new audit ledger entry.
          </small>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
            <button type="button" className="secondary-btn" onClick={() => setIsEditOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Updating..." : "Commit Change"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default AdminInventory;

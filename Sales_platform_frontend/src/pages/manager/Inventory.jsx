import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatDate } from "../../utils/formatDate";
import { getInventory, updateInventory, getInventoryTransactions } from "../../services/inventoryService";

function ManagerInventory() {
  const { userName } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("stock");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [newMinStock, setNewMinStock] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [invRes, transRes] = await Promise.allSettled([
        getInventory(),
        getInventoryTransactions(),
      ]);

      if (invRes.status === "fulfilled") {
        setInventory(Array.isArray(invRes.value?.data) ? invRes.value.data : []);
      }
      if (transRes.status === "fulfilled") {
        setTransactions(Array.isArray(transRes.value?.data) ? transRes.value.data : []);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load inventory.");
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
    setNewMinStock(item.minimumStock ?? item.minStock ?? 5);
    setIsEditOpen(true);
  };

  const handleSaveStock = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      setSubmitting(true);
      setError("");
      const id = selectedItem.id ?? selectedItem.inventoryId;
      await updateInventory(id, {
        quantity: Number(newQuantity),
        minimumStock: Number(newMinStock),
      });
      setSuccessMsg("Inventory record updated.");
      setIsEditOpen(false);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update inventory.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout title="Inventory" breadcrumb={["Dashboard", "Inventory"]} userName={userName || "Manager"}>
      <div className="panel-card" style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h3 style={{ margin: 0 }}>Stock & Inventory Control</h3>
            <small style={{ color: "var(--text-muted)" }}>Monitor stock counts and log inventory flow</small>
          </div>

          <div style={{ display: "inline-flex", gap: 8, background: "var(--bg-subtle)", padding: 4, borderRadius: 10 }}>
            <button
              type="button"
              className={activeTab === "stock" ? "primary-btn" : "secondary-btn"}
              style={{ padding: "8px 14px", fontSize: "0.85rem" }}
              onClick={() => setActiveTab("stock")}
            >
              Current Stock
            </button>
            <button
              type="button"
              className={activeTab === "transactions" ? "primary-btn" : "secondary-btn"}
              style={{ padding: "8px 14px", fontSize: "0.85rem" }}
              onClick={() => setActiveTab("transactions")}
            >
              Movement Log
            </button>
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
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Available Quantity</th>
                    <th>Minimum Threshold</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const id = item.id ?? item.inventoryId;
                    const qty = item.quantity ?? 0;
                    const min = item.minimumStock ?? item.minStock ?? 5;
                    const isLow = qty <= min;

                    return (
                      <tr key={id}>
                        <td><strong>{item.product?.name || item.productName || `Product #${item.productId}`}</strong></td>
                        <td><span className="sku-badge">{item.product?.sku || item.sku || "-"}</span></td>
                        <td><strong>{qty}</strong> units</td>
                        <td>{min} units</td>
                        <td>
                          <span className={`badge ${isLow ? "badge-danger" : "badge-success"}`}>
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
                            Update
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
            <div className="empty-state">No transaction logs available.</div>
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

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Stock Level">
        <form className="form-grid" onSubmit={handleSaveStock}>
          <div className="field-group">
            <label>Product</label>
            <strong>{selectedItem?.product?.name || selectedItem?.productName || "Product"}</strong>
          </div>

          <div className="field-group">
            <label htmlFor="mgrInvQty">Available Quantity *</label>
            <input
              id="mgrInvQty"
              type="number"
              min="0"
              className="input"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="mgrInvMin">Minimum Stock Threshold *</label>
            <input
              id="mgrInvMin"
              type="number"
              min="0"
              className="input"
              value={newMinStock}
              onChange={(e) => setNewMinStock(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
            <button type="button" className="secondary-btn" onClick={() => setIsEditOpen(false)}>Cancel</button>
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default ManagerInventory;

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getInventory } from "../../services/inventoryService";

function EmployeeInventory() {
  const { userName } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getInventory();
      setInventory(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load inventory records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <MainLayout title="Inventory" breadcrumb={["Dashboard", "Inventory"]} userName={userName || "Employee"}>
      <div className="panel-card" style={{ display: "grid", gap: 18 }}>
        <div>
          <h3 style={{ margin: 0 }}>Warehouse Stock Levels</h3>
          <small style={{ color: "var(--text-muted)" }}>Current available inventory counts and threshold warnings</small>
        </div>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Checking stock status..." />
        ) : !inventory.length ? (
          <div className="empty-state">No inventory records found.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Available Quantity</th>
                  <th>Minimum Stock</th>
                  <th>Status</th>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default EmployeeInventory;

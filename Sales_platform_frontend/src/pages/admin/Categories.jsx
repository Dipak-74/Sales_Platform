import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import {
  getCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
} from "../../services/categoryService";

function AdminCategories() {
  const { userName } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getCategories();
      setCategories(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openForm = (category = null) => {
    setEditing(category);
    setForm({
      name: category?.name || "",
      description: category?.description || "",
    });
    setError("");
    setOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const id = editing?.categoryId ?? editing?.id;
      if (id) {
        await updateCategory(id, form);
        setSuccess("Category updated successfully.");
      } else {
        await createCategory(form);
        setSuccess("Category created successfully.");
      }
      setOpen(false);
      await loadCategories();
      window.setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Category operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (category) => {
    const id = category.categoryId ?? category.id;
    const status = category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      setError("");
      await updateCategoryStatus(id, status);
      setSuccess(`Category ${status.toLowerCase()}d successfully.`);
      await loadCategories();
      window.setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update category status.");
    }
  };

  return (
    <MainLayout title="Categories" breadcrumb={["Dashboard", "Categories"]} userName={userName || "Admin"}>
      <div className="panel-card" style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0 }}>Category Management</h3>
            <small style={{ color: "var(--text-muted)" }}>Organize products for browsing and reporting</small>
          </div>
          <button type="button" className="primary-btn" onClick={() => openForm()}>+ Add Category</button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <ErrorMessage message={error} />}
        {loading ? <Loader text="Loading categories..." /> : !categories.length ? (
          <div className="empty-state">No categories configured yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Status</th><th /></tr></thead>
              <tbody>{categories.map((category) => {
                const id = category.categoryId ?? category.id;
                const inactive = category.status === "INACTIVE";
                return <tr key={id}>
                  <td>#{id}</td><td><strong>{category.name}</strong></td><td>{category.description || "-"}</td>
                  <td><span className={`badge ${inactive ? "badge-danger" : "badge-success"}`}>{category.status || "ACTIVE"}</span></td>
                  <td style={{ textAlign: "right" }}>
                    <button type="button" className="secondary-btn" onClick={() => openForm(category)}>Edit</button>{" "}
                    <button type="button" className={inactive ? "secondary-btn" : "danger-btn"} onClick={() => toggleStatus(category)}>{inactive ? "Activate" : "Deactivate"}</button>
                  </td>
                </tr>;
              })}</tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={open} onClose={() => !saving && setOpen(false)} title={editing ? "Edit Category" : "Add Category"}>
        <form className="form-grid" onSubmit={submit}>
          <div className="field-group"><label htmlFor="categoryName">Name *</label><input id="categoryName" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="field-group"><label htmlFor="categoryDescription">Description</label><textarea id="categoryDescription" className="input" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}><button type="button" className="secondary-btn" onClick={() => setOpen(false)} disabled={saving}>Cancel</button><button type="submit" className="primary-btn" disabled={saving}>{saving ? "Saving..." : "Save Category"}</button></div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default AdminCategories;
import { useState, useEffect } from "react";
import { validateProductForm } from "../../utils/validation";

function ProductForm({
  initialData = null,
  categories = [],
  onSubmit,
  onCancel,
  onCreateCategory,
  loading = false,
}) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    categoryId: "",
    description: "",
    costPrice: "",
    sellingPrice: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    setForm({
      name: initialData?.name || "",
      sku: initialData?.sku || "",
      categoryId: initialData?.category?.id || initialData?.categoryId || "",
      description: initialData?.description || "",
      costPrice: initialData?.costPrice ?? "",
      sellingPrice: initialData?.sellingPrice ?? initialData?.price ?? "",
      imageUrl: initialData?.imageUrl || "",
    });
    setImageFile(null);
    setImagePreview(initialData?.imageUrl || "");
    setErrors({});
    setNewCategoryName("");
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select a valid image file." }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB." }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleImageUrlChange = (e) => {
    const imageUrl = e.target.value;
    setForm((prev) => ({ ...prev, imageUrl }));
    if (!imageFile) setImagePreview(imageUrl);
    if (imageUrl) setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleCreateCategory = async () => {
    if (!onCreateCategory || !newCategoryName.trim()) {
      setErrors((prev) => ({ ...prev, categoryId: "Enter a category name first." }));
      return;
    }

    try {
      setCreatingCategory(true);
      const category = await onCreateCategory({ name: newCategoryName.trim() });
      const categoryId = category?.categoryId ?? category?.id;
      if (categoryId) {
        setForm((prev) => ({ ...prev, categoryId }));
      }
      setNewCategoryName("");
    } catch {
      // Parent displays the API error.
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productPayload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      categoryId: Number(form.categoryId),
      description: form.description.trim(),
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      imageUrl: form.imageUrl.trim(),
    };

    const validationErrors = validateProductForm(productPayload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(productPayload, imageFile);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="field-group">
        <label htmlFor="name">Product Name *</label>
        <input
          id="name"
          name="name"
          className="input"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Wireless Noise-Cancelling Headphones"
        />
        {errors.name && <small className="field-error">{errors.name}</small>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field-group">
          <label htmlFor="sku">SKU Code *</label>
          <input
            id="sku"
            name="sku"
            className="input"
            type="text"
            value={form.sku}
            onChange={handleChange}
            placeholder="e.g. WH-1000XM5"
          />
          {errors.sku && <small className="field-error">{errors.sku}</small>}
        </div>

        <div className="field-group">
          <label htmlFor="categoryId">Category *</label>
          <select
            id="categoryId"
            name="categoryId"
            className="select"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.categoryId ?? cat.id} value={cat.categoryId ?? cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <small className="field-error">{errors.categoryId}</small>}
          {onCreateCategory && (
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                className="input"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
              />
              <button type="button" className="secondary-btn" onClick={handleCreateCategory} disabled={creatingCategory}>
                {creatingCategory ? "Adding..." : "Add Category"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field-group">
          <label htmlFor="costPrice">Cost Price (₹)</label>
          <input
            id="costPrice"
            name="costPrice"
            className="input"
            type="number"
            step="0.01"
            min="0"
            value={form.costPrice}
            onChange={handleChange}
            placeholder="0.00"
          />
          {errors.costPrice && <small className="field-error">{errors.costPrice}</small>}
        </div>

        <div className="field-group">
          <label htmlFor="sellingPrice">Selling Price (₹) *</label>
          <input
            id="sellingPrice"
            name="sellingPrice"
            className="input"
            type="number"
            step="0.01"
            min="0"
            value={form.sellingPrice}
            onChange={handleChange}
            placeholder="0.00"
          />
          {errors.sellingPrice && <small className="field-error">{errors.sellingPrice}</small>}
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="input"
          rows="3"
          value={form.description}
          onChange={handleChange}
          placeholder="Detailed product specifications and highlights..."
        />
      </div>

      <div className="field-group">
        <label htmlFor="productImage">Product Image</label>
        <input
          id="productImage"
          type="file"
          accept="image/*"
          className="input"
          onChange={handleImageChange}
        />
        {errors.image && <small className="field-error">{errors.image}</small>}

        <input
          id="productImageUrl"
          name="imageUrl"
          className="input"
          type="url"
          value={form.imageUrl}
          onChange={handleImageUrlChange}
          placeholder="Or paste an image URL"
          style={{ marginTop: 8 }}
        />
        <small style={{ color: "var(--text-muted)" }}>Choose a file or provide a public image URL.</small>

        {imagePreview && (
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxHeight: 150, maxWidth: "100%", borderRadius: 12, objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
        {onCancel && (
          <button type="button" className="secondary-btn" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;


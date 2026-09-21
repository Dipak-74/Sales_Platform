import { useEffect, useState, useCallback } from "react";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import {
  getCustomerProfile,
  updateCustomerProfile,
} from "../../services/customerService";
import {
  getCustomerAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../services/customerAddressService";

function CustomerProfile() {
  const { userName, email, role, userId } = useAuth();

  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Phone edit state
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneSaving, setPhoneSaving] = useState(false);

  // Address modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addressSubmitting, setAddressSubmitting] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressType: "HOME",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError("");

      const profRes = await getCustomerProfile(userId);
      const cust = profRes?.data;
      setCustomer(cust);
      setPhoneInput(cust?.phone || "");

      const cId = cust?.customerId ?? cust?.id;
      if (cId) {
        const addrRes = await getCustomerAddresses(cId);
        setAddresses(Array.isArray(addrRes?.data) ? addrRes.data : []);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load customer profile details."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    const cId = customer?.customerId ?? customer?.id;
    const normalizedPhone = phoneInput.trim();

    if (!/^\d{10}$/.test(normalizedPhone)) {
      setError("Mobile number must contain exactly 10 digits.");
      return;
    }

    if (!cId) {
      setError("Unable to identify the customer profile.");
      return;
    }

    try {
      setPhoneSaving(true);
      setError("");
      await updateCustomerProfile(cId, { phone: normalizedPhone });
      setCustomer((prev) => ({ ...prev, phone: normalizedPhone }));
      setPhoneInput(normalizedPhone);
      setIsEditingPhone(false);
      showSuccess("Phone number updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update phone number.");
    } finally {
      setPhoneSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const cId = customer?.customerId ?? customer?.id ?? Number(userId);

    if (!newAddress.addressLine.trim() || !newAddress.city.trim()) {
      setError("Address line and City are required.");
      return;
    }

    try {
      setAddressSubmitting(true);
      setError("");

      const payload = {
        customerId: cId,
        addressLine: newAddress.addressLine.trim(),
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        pincode: newAddress.pincode.trim(),
        country: newAddress.country.trim() || "India",
        addressType: newAddress.addressType,
        isDefault: Boolean(newAddress.isDefault),
      };

      await addAddress(payload);
      showSuccess("Address added successfully.");
      setIsAddModalOpen(false);
      setNewAddress({
        addressType: "HOME",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        isDefault: false,
      });

      // Reload addresses
      if (cId) {
        const addrRes = await getCustomerAddresses(cId);
        setAddresses(Array.isArray(addrRes?.data) ? addrRes.data : []);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add address.");
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      setError("");
      await setDefaultAddress(addressId);
      showSuccess("Default address updated.");
      const cId = customer?.customerId ?? customer?.id;
      if (cId) {
        const addrRes = await getCustomerAddresses(cId);
        setAddresses(Array.isArray(addrRes?.data) ? addrRes.data : []);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to set default address."
      );
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      setError("");
      await deleteAddress(addressId);
      showSuccess("Address removed.");
      const cId = customer?.customerId ?? customer?.id;
      if (cId) {
        const addrRes = await getCustomerAddresses(cId);
        setAddresses(Array.isArray(addrRes?.data) ? addrRes.data : []);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to remove address.");
    }
  };

  return (
    <MainLayout
      title="My Customer Profile"
      breadcrumb={["Dashboard", "Profile"]}
      userName={userName || "Customer"}
    >
      <div style={{ display: "grid", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loader text="Loading your profile and addresses..." />
        ) : (
          <>
            {/* Customer Account Info */}
            <div className="panel-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {String(customer?.name || userName || "C").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: "0 0 4px 0" }}>
                    {customer?.name || userName || "Customer"}
                  </h3>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <span className="badge badge-success">{role || "CUSTOMER"}</span>
                    {customer?.customerCode && (
                      <span className="badge">Code: {customer.customerCode}</span>
                    )}
                    {customer?.status && (
                      <span className="badge badge-info">{customer.status}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="info-list" style={{ marginTop: 24 }}>
                <div>
                  <span>Account Email</span>
                  <strong>{customer?.email || email || "Not specified"}</strong>
                </div>
                <div>
                  <span>Customer ID</span>
                  <strong>#{customer?.customerId ?? customer?.id ?? "-"}</strong>
                </div>
                <div>
                  <span>Phone Number</span>
                  <div>
                    {isEditingPhone ? (
                      <form
                        onSubmit={handleUpdatePhone}
                        style={{ display: "flex", gap: 8, alignItems: "center" }}
                      >
                        <input
                          className="input"
                          style={{ width: 160, padding: "4px 8px", fontSize: "0.9rem" }}
                          value={phoneInput}
                          onChange={(e) =>
                            setPhoneInput(e.target.value.replace(/\D/g, "").slice(0, 10))
                          }
                          placeholder="10-digit mobile number"
                          inputMode="numeric"
                          maxLength={10}
                          pattern="[0-9]{10}"
                          required
                        />
                        <button
                          type="submit"
                          className="primary-btn"
                          style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                          disabled={phoneSaving}
                        >
                          {phoneSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          className="secondary-btn"
                          style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                          onClick={() => {
                            setPhoneInput(customer?.phone || "");
                            setIsEditingPhone(false);
                          }}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <strong>{customer?.phone || "No phone added"}</strong>
                        <button
                          type="button"
                          className="secondary-btn"
                          style={{ padding: "3px 8px", fontSize: "0.75rem" }}
                          onClick={() => setIsEditingPhone(true)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Delivery Addresses */}
            <div className="panel-card" style={{ display: "grid", gap: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>Saved Delivery Addresses</h3>
                  <small style={{ color: "var(--text-muted)" }}>
                    Manage shipping and billing addresses for fast order checkout
                  </small>
                </div>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  + Add New Address
                </button>
              </div>

              {!addresses.length ? (
                <div className="empty-state">
                  No saved addresses found. Add an address for seamless checkout!
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 16,
                  }}
                >
                  {addresses.map((addr) => {
                    const id = addr.addressId ?? addr.id;
                    return (
                      <div
                        key={id}
                        className="panel-card"
                        style={{
                          padding: 18,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          border: addr.isDefault
                            ? "2px solid var(--primary)"
                            : "1px solid var(--border)",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 10,
                            }}
                          >
                            <span className="badge badge-info">
                              {addr.addressType || "HOME"}
                            </span>
                            {addr.isDefault && (
                              <span className="badge badge-success">
                                Default Address
                              </span>
                            )}
                          </div>

                          <p
                            style={{
                              margin: "0 0 6px",
                              color: "var(--text-main)",
                              fontWeight: 600,
                            }}
                          >
                            {addr.addressLine}
                          </p>
                          <p
                            style={{
                              margin: "0 0 4px",
                              color: "var(--text-secondary)",
                              fontSize: "0.9rem",
                            }}
                          >
                            {[addr.city, addr.state, addr.pincode]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                          <small style={{ color: "var(--text-muted)" }}>
                            {addr.country || "India"}
                          </small>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 16,
                            paddingTop: 12,
                            borderTop: "1px solid var(--border-subtle)",
                          }}
                        >
                          {!addr.isDefault ? (
                            <button
                              type="button"
                              className="secondary-btn"
                              style={{ padding: "5px 10px", fontSize: "0.78rem" }}
                              onClick={() => handleSetDefault(id)}
                            >
                              Set as Default
                            </button>
                          ) : (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--success)",
                                fontWeight: 500,
                              }}
                            >
                              ✓ Primary
                            </span>
                          )}

                          <button
                            type="button"
                            className="danger-btn"
                            style={{ padding: "5px 10px", fontSize: "0.78rem" }}
                            onClick={() => handleDeleteAddress(id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Address"
      >
        <form className="form-grid" onSubmit={handleAddAddress}>
          <div className="field-group">
            <label htmlFor="addrType">Address Type</label>
            <select
              id="addrType"
              className="select"
              value={newAddress.addressType}
              onChange={(e) =>
                setNewAddress((prev) => ({
                  ...prev,
                  addressType: e.target.value,
                }))
              }
            >
              <option value="HOME">HOME</option>
              <option value="OFFICE">OFFICE</option>
              <option value="BILLING">BILLING</option>
              <option value="SHIPPING">SHIPPING</option>
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="addrLine">Street Address / Line *</label>
            <input
              id="addrLine"
              className="input"
              value={newAddress.addressLine}
              onChange={(e) =>
                setNewAddress((prev) => ({
                  ...prev,
                  addressLine: e.target.value,
                }))
              }
              placeholder="Flat/House No., Building, Street Name"
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div className="field-group">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                className="input"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                placeholder="City"
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="state">State</label>
              <input
                id="state"
                className="input"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress((prev) => ({
                    ...prev,
                    state: e.target.value,
                  }))
                }
                placeholder="State"
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div className="field-group">
              <label htmlFor="pincode">Pincode / Postal Code</label>
              <input
                id="pincode"
                className="input"
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress((prev) => ({
                    ...prev,
                    pincode: e.target.value,
                  }))
                }
                placeholder="6-digit pincode"
              />
            </div>
            <div className="field-group">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                className="input"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                placeholder="India"
              />
            </div>
          </div>

          <div className="field-group" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              id="isDefault"
              checked={newAddress.isDefault}
              onChange={(e) =>
                setNewAddress((prev) => ({
                  ...prev,
                  isDefault: e.target.checked,
                }))
              }
              style={{ width: 18, height: 18, cursor: "pointer" }}
            />
            <label htmlFor="isDefault" style={{ cursor: "pointer", margin: 0 }}>
              Set as default delivery address
            </label>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 14,
            }}
          >
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn"
              disabled={addressSubmitting}
            >
              {addressSubmitting ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default CustomerProfile;

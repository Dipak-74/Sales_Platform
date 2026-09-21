import Modal from "./Modal";
import Button from "./Button";

function ConfirmDialog({ isOpen, title = "Please confirm", message, confirmLabel = "Confirm", onConfirm, onClose, loading = false }) {
  return <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div style={{ display: "grid", gap: 18 }}>
      <p>{message}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>{loading ? "Working..." : confirmLabel}</Button>
      </div>
    </div>
  </Modal>;
}

export default ConfirmDialog;

import React from "react";
import Modal from "./Modal";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = "Confirm Action", message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ padding: "8px 0" }}>
        <p style={{
          fontSize: "14px",
          color: "#4b5563",
          margin: "0 0 24px 0",
          lineHeight: "1.5"
        }}>{message}</p>
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px"
        }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              border: "1px solid #d1d5db",
              backgroundColor: "#ffffff",
              borderRadius: "6px",
              fontSize: "14px",
              color: "#374151",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              border: "none",
              backgroundColor: "#C62828",
              borderRadius: "6px",
              fontSize: "14px",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

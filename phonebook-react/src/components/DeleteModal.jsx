import React from "react";
import "../styling/ConfirmationModal.css"; 

export default function ConfirmationModal ({ show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Apakah Anda yakin menghapus data ini?</p>
        <div className="button-box">
          <button className="button-confirm" onClick={onConfirm}>
            Ya
          </button>
          <button className="button-cancel" onClick={onCancel}>
            Tidak
          </button>
        </div>
      </div>
    </div>
  );
};
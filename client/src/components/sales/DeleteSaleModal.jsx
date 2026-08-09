import { FaExclamationTriangle } from "react-icons/fa";

import "../../styles/deleteSaleModal.css";

function DeleteSaleModal({
  sale,
  onClose,
  onDelete,
}) {
  if (!sale) return null;

  return (
    <div className="modal-overlay">

      <div className="delete-modal">

        <div className="delete-icon">
          <FaExclamationTriangle />
        </div>

        <h2>Delete Sale</h2>

        <p>
          Are you sure you want to delete this sale?
        </p>

        <div className="sale-info">

          <p>
            <strong>Invoice:</strong>{" "}
            {sale.invoice_no}
          </p>

          <p>
            <strong>Customer:</strong>{" "}
            {sale.customer_name}
          </p>

          <p>
            <strong>Product:</strong>{" "}
            {sale.product_name}
          </p>

          <p>
            <strong>Total:</strong>{" "}
            ₹{Number(
              sale.total_amount || 0
            ).toLocaleString()}
          </p>

        </div>

        <div className="modal-actions">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="delete-btn"
            onClick={() => onDelete(sale)}
          >
            Delete Sale
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteSaleModal;
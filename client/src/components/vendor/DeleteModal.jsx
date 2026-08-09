import "../../styles/deleteModal.css";

function DeleteModal({ product, onClose, onDelete }) {
  return (
    <div className="modal-overlay">

      <div className="delete-modal">

        <h2>Delete Product?</h2>

        <p>
          Are you sure you want to delete
          <strong> {product.product_name}</strong>?
        </p>

        <div className="delete-actions">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="delete-btn"
            onClick={onDelete}
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteModal;
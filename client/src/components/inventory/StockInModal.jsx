import { useState } from "react";
import {
  FaTimes,
  FaBoxes,
  FaHashtag,
} from "react-icons/fa";

import "../../styles/inventoryModal.css";

function StockInModal({
  product,
  onClose,
  onSuccess,
}) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product) return;

    if (Number(quantity) <= 0) {
      setMessage("Quantity must be greater than 0.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `http://localhost:5000/inventory/stock-in/${product.product_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: Number(quantity),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add stock."
        );
      }

      onSuccess();

    } catch (error) {
      console.log(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="inventory-modal">

        <div className="modal-header">

          <h2>Stock In</h2>

          <button
            type="button"
            onClick={onClose}
          >
            <FaTimes />
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="inventory-product-info">

            <FaBoxes />

            <div>
              <strong>
                {product?.product_name}
              </strong>

              <small>
                Current Stock: {product?.stock || 0}
              </small>
            </div>

          </div>

          <div className="input-group">

            <FaHashtag />

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              placeholder="Quantity"
              required
            />

          </div>

          {message && (
            <p className="inventory-modal-message">
              {message}
            </p>
          )}

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Stock"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default StockInModal;
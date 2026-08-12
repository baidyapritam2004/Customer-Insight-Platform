import { useState } from "react";
import {
  FaTimes,
  FaBoxes,
  FaHashtag,
} from "react-icons/fa";

import "../../styles/stockOutModal.css";
const API_URL = import.meta.env.VITE_API_URL;
function StockOutModal({
  product,
  onClose,
  onSuccess,
}) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const currentStock = Number(product?.stock || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestedQuantity = Number(quantity);

    if (requestedQuantity <= 0) {
      setMessage("Quantity must be greater than 0.");
      return;
    }

    if (requestedQuantity > currentStock) {
      setMessage("Insufficient stock.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/inventory/stock-out/${product.product_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: requestedQuantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to deduct stock."
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

          <h2>Stock Out</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
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
                Current Stock: {currentStock}
              </small>
            </div>

          </div>

          <div className="input-group">

            <FaHashtag />

            <input
              type="number"
              min="1"
              max={currentStock}
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
              disabled={loading || currentStock === 0}
            >
              {loading ? "Processing..." : "Remove Stock"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default StockOutModal;
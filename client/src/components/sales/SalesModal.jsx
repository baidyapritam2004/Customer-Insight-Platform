import { useEffect, useState } from "react";
import {
  FaTimes,
  FaUser,
  FaBox,
  FaHashtag,
  FaRupeeSign,
  FaMoneyBillWave,
  FaClipboardCheck,
} from "react-icons/fa";

import "../../styles/salesModal.css";

function SalesModal({
  title,
  sale,
  products = [],
  onClose,
  onSave,
}) {

  const [form, setForm] = useState({
    customer_name: "",
    product_id: "",
    quantity: 1,
    payment_method: "Cash",
    status: "Pending",
    price: 0,
    total: 0,
  });

  useEffect(() => {

    if (sale) {

      setForm({
        customer_name: sale.customer_name || "",
        product_id: sale.product_id || "",
        quantity: sale.quantity || 1,
        payment_method: sale.payment_method || "Cash",
        status: sale.status || "Pending",
        price: sale.price || 0,
        total: sale.total || 0,
      });

    }

  }, [sale]);

  useEffect(() => {

    const selectedProduct = products.find(
      (p) => p.product_id === form.product_id
    );

    if (selectedProduct) {

      const price = Number(selectedProduct.price);

      setForm((prev) => ({
        ...prev,
        price,
        total: price * Number(prev.quantity),
      }));

    }

  }, [form.product_id, form.quantity, products]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const submit = (e) => {

    e.preventDefault();

    onSave({
      customer_name: form.customer_name,
      product_id: form.product_id,
      quantity: Number(form.quantity),
      payment_method: form.payment_method,
      status: form.status,
    });

  };

  return (
    <div className="modal-overlay">

      <div className="sales-modal">

        <div className="modal-header">

          <h2>{title}</h2>

          <button
            type="button"
            onClick={onClose}
          >
            <FaTimes />
          </button>

        </div>

        <form onSubmit={submit}>

          <div className="input-group">
            <FaUser />

            <input
              type="text"
              name="customer_name"
              placeholder="Customer Name"
              value={form.customer_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaBox />

            <select
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Product
              </option>

              {products.map((product) => (

                <option
                  key={product.product_id}
                  value={product.product_id}
                >
                  {product.product_name}
                </option>

              ))}

            </select>
          </div>

          <div className="input-group">
            <FaHashtag />

            <input
              type="number"
              name="quantity"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="double-input">

  <div>
    <label>Unit Price</label>

    <div className="input-group">
      <FaRupeeSign />
      <input
        type="number"
        value={form.price}
        readOnly
      />
    </div>
  </div>

  <div>
    <label>Total Amount</label>

    <div className="input-group">
      <FaRupeeSign />
      <input
        type="number"
        value={form.total}
        readOnly
      />
    </div>
  </div>

</div>

          <div className="input-group">
            <FaMoneyBillWave />

            <select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
            >
              <option>Cash</option>
              <option>Card</option>
              <option>UPI</option>
              <option>Net Banking</option>
            </select>
          </div>

          <div className="input-group">
            <FaClipboardCheck />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              Save Sale
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default SalesModal;
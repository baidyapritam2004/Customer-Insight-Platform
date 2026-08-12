import { useEffect, useState } from "react";
import {
  FaTimes,
  FaBox,
  FaTag,
  FaRupeeSign,
  FaWarehouse,
  FaImage,
  FaAlignLeft,
} from "react-icons/fa";

import "../../styles/productModal.css";
const API_URL = import.meta.env.VITE_API_URL;
function ProductModal({ title, product, onClose, onSave }) {
  const [form, setForm] = useState({
    product_name: "",
    category: "",
    brand: "",
    description: "",
    price: "",
    stock: "",
    warehouse: "",
    image: "",
  });
const [preview, setPreview] = useState("");

  useEffect(() => {
  if (product) {
    setForm({
      product_name: product.product_name || "",
      category: product.category || "",
      brand: product.brand || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      warehouse: product.warehouse || "",
      image: product.image || "",
    });

    setPreview("");
  } else {
    setForm({
      product_name: "",
      category: "",
      brand: "",
      description: "",
      price: "",
      stock: "",
      warehouse: "",
      image: "",
    });

    setPreview("");
  }
}, [product]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    onSave({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="product-modal">
        <div className="modal-header">
          <h2>{title}</h2>

          <button type="button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="input-group">
            <FaBox />
            <input
              type="text"
              name="product_name"
              placeholder="Product Name"
              value={form.product_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaTag />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaTag />
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
            />
          </div>

          <div className="double-input">
            <div className="input-group">
              <FaRupeeSign />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FaWarehouse />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <FaWarehouse />
            <input
              type="text"
              name="warehouse"
              placeholder="Warehouse"
              value={form.warehouse}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
  <FaImage />

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];

      setForm({
        ...form,
        image: file,
      });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    }}
  />

  {product?.image && !(form.image instanceof File) && (
    <img
      src={`${API_URL}${product.image}`}
      alt="Product"
      className="preview-image"
    />
  )}

  {preview && (
    <img
      src={preview}
      alt="Preview"
      className="preview-image"
    />
  )}
</div>

          <div className="input-group textarea">
            <FaAlignLeft />
            <textarea
              name="description"
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;

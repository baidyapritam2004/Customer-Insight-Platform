import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  FaPlus,
  FaSearch,
  FaBox,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import "../../styles/vendorProducts.css";
import ProductModal from "../../components/vendor/ProductModal";
function VendorProducts() {
  const user = JSON.parse(localStorage.getItem("user"));

  const vendorId = user?.vendor_id;

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [status, setStatus] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [page, setPage] = useState(1);

  const productsPerPage = 8;

  const fetchProducts = () => {
    if (!vendorId) return;

    axios
      .get(`http://localhost:5000/vendor/products/${vendorId}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch(console.error);
  };
  useEffect(() => {
    if (!vendorId) {
      setLoading(false);
      return;
    }

    fetchProducts();
  }, [vendorId]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.product_name?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === "All" || product.category === category;

      let stockStatus = "Active";

      if (product.stock <= 0) stockStatus = "Out of Stock";
      else if (product.stock <= 5) stockStatus = "Low Stock";

      const matchStatus = status === "All" || status === stockStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, search, category, status]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const currentProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage,
  );

  const summary = {
    total: products.length,

    active: products.filter((p) => p.stock > 5).length,

    low: products.filter((p) => p.stock > 0 && p.stock <= 5).length,

    out: products.filter((p) => p.stock === 0).length,
  };

  if (loading) {
    return (
      <div className="page-loading">
        <h2>Loading Products...</h2>
      </div>
    );
  }

  return (
    <div className="vendor-product-page">
      <div className="page-title">
        <div>
          <h2>Products</h2>

          <p>Manage your product catalogue.</p>
        </div>

        <button className="primary-btn" onClick={() => setShowAddModal(true)}>
          <FaPlus />
          Add Product
        </button>
      </div>

      {/* Summary */}

      <div className="summary-grid">
        <div className="summary-card">
          <FaBox />

          <div>
            <h2>{summary.total}</h2>

            <span>Total Products</span>
          </div>
        </div>

        <div className="summary-card success">
          <FaCheckCircle />

          <div>
            <h2>{summary.active}</h2>

            <span>Active</span>
          </div>
        </div>

        <div className="summary-card warning">
          <FaExclamationTriangle />

          <div>
            <h2>{summary.low}</h2>

            <span>Low Stock</span>
          </div>
        </div>

        <div className="summary-card danger">
          <FaTimesCircle />

          <div>
            <h2>{summary.out}</h2>

            <span>Out of Stock</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}

      <div className="toolbar">
        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>

          <option>Active</option>

          <option>Low Stock</option>

          <option>Out of Stock</option>
        </select>
      </div>

      {/* ================= Products Table ================= */}

      <div className="table-card">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>

              <th>Product</th>

              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>

              <th>Stock</th>
              <th>Warehouse</th>
              <th>Rating</th>

              <th>Status</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => {
                const status =
                  product.stock === 0
                    ? "Out of Stock"
                    : product.stock <= 5
                      ? "Low Stock"
                      : "Active";

                return (
                  <tr key={product.product_id}>
                    <td>
                      <img
                        src={
                          product.image
                            ? `http://localhost:5000/uploads/${product.image}`
                            : "https://placehold.co/60x60"
                        }
                        alt={product.product_name}
                        className="product-image"
                      />
                    </td>

                    <td>
                      <div className="product-name">
                        <strong>{product.product_name}</strong>

                        <small>{product.description}</small>

                        <small>ID: {product.product_id}</small>
                      </div>
                    </td>

                    <td>{product.category}</td>

                    <td>{product.brand || "-"}</td>

                    <td>₹{Number(product.price || 0).toLocaleString()}</td>
                    <td>{product.stock}</td>
                    <td>{product.warehouse}</td>
                    <td>⭐{Number(product.rating || 0).toFixed(1)}</td>

                    <td>
                      <span
                        className={`status-badge ${status
                          .toLowerCase()
                          .replace(/\s/g, "-")}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setSelectedProduct(product);

                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => {
                            setSelectedProduct(product);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= Pagination ================= */}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active-page" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* ================= Add Product Modal ================= */}

      {showAddModal && (
        <ProductModal
          title="Add Product"
          product={null}
          onClose={() => setShowAddModal(false)}
          onSave={async (product) => {
            try {
              await axios.post("http://localhost:5000/product/add", {
                ...product,
                vendor_id: vendorId,
              });

              setShowAddModal(false);

              fetchProducts();
            } catch (err) {
              console.log(err);
            }
          }}
        />
      )}

      {/* ================= Edit Product Modal ================= */}

      {showEditModal && (
        <ProductModal
          title="Edit Product"
          product={selectedProduct}
          onClose={() => setShowEditModal(false)}
          onSave={async (product) => {
            try {
              await axios.put(
                `http://localhost:5000/product/update/${selectedProduct.product_id}`,
                product,
              );

              setShowEditModal(false);
              fetchProducts();
            } catch (err) {
              console.log(err);
            }
          }}
        />
      )}
    </div>
  );
}

export default VendorProducts;

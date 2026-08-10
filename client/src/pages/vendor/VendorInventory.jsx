import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import "../../styles/vendorInventory.css";

import StockInModal from "../../components/inventory/StockInModal";
import StockOutModal from "../../components/inventory/StockOutModal";

import {
  FaSearch,
  FaBox,
  FaBoxes,
  FaExclamationTriangle,
  FaTimesCircle,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";

function VendorInventory() {
  const vendorId = localStorage.getItem("vendor_id");

  const [products, setProducts] = useState([]);
  const [dashboard, setDashboard] = useState({});

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [warehouseFilter, setWarehouseFilter] = useState("All");

  const [showStockInModal, setShowStockInModal] = useState(false);
  const [showStockOutModal, setShowStockOutModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = 10;

  /* ===========================
     Fetch Products
  =========================== */

  const fetchProducts = async () => {
    if (!vendorId) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/vendor/products/${vendorId}`
      );

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     Fetch Inventory Dashboard
  =========================== */

  const fetchDashboard = async () => {
    if (!vendorId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/inventory/dashboard/${vendorId}`
      );

      setDashboard(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ===========================
     Initial Load
  =========================== */

  useEffect(() => {
    fetchProducts();
    fetchDashboard();
  }, []);

  /* ===========================
     Warehouses
  =========================== */

  const warehouses = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.warehouse)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  /* ===========================
     Filter Products
  =========================== */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        product.product_name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.product_id
          ?.toLowerCase()
          .includes(searchValue) ||
        product.brand
          ?.toLowerCase()
          .includes(searchValue);

      const stock = Number(product.stock || 0);

      let status = "Healthy";

      if (stock === 0) {
        status = "Out of Stock";
      } else if (stock <= 20) {
        status = "Low Stock";
      }

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      const matchesWarehouse =
        warehouseFilter === "All" ||
        product.warehouse === warehouseFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesWarehouse
      );
    });
  }, [
    products,
    search,
    statusFilter,
    warehouseFilter,
  ]);

  /* ===========================
     Reset Page on Filter
  =========================== */

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, warehouseFilter]);

  /* ===========================
     Pagination
  =========================== */

  const totalPages = Math.ceil(
    filteredProducts.length / perPage
  );

  const currentProducts = filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /* ===========================
     Stock Status
  =========================== */

  const getStockStatus = (stock) => {
    stock = Number(stock || 0);

    if (stock === 0) {
      return "Out of Stock";
    }

    if (stock <= 20) {
      return "Low Stock";
    }

    return "Healthy";
  };

  return (
    <div className="vendor-inventory-page">

      {/* ===========================
          Page Header
      =========================== */}

      <div className="page-title">
        <div>
          <h2>Inventory</h2>
          <p>Monitor and manage your product stock</p>
        </div>
      </div>

      {/* ===========================
          Summary Cards
      =========================== */}

      <div className="inventory-summary-grid">

        <div className="inventory-summary-card">
          <FaBox />

          <div>
            <h2>
              {dashboard.total_products ?? products.length}
            </h2>

            <span>Total Products</span>
          </div>
        </div>

        <div className="inventory-summary-card success">
          <FaBoxes />

          <div>
            <h2>
              {dashboard.total_stock ??
                products.reduce(
                  (sum, product) =>
                    sum + Number(product.stock || 0),
                  0
                )}
            </h2>

            <span>Total Stock</span>
          </div>
        </div>

        <div className="inventory-summary-card warning">
          <FaExclamationTriangle />

          <div>
            <h2>
              {dashboard.low_stock ??
                products.filter(
                  (product) =>
                    Number(product.stock || 0) > 0 &&
                    Number(product.stock || 0) <= 20
                ).length}
            </h2>

            <span>Low Stock</span>
          </div>
        </div>

        <div className="inventory-summary-card danger">
          <FaTimesCircle />

          <div>
            <h2>
              {dashboard.out_of_stock ??
                products.filter(
                  (product) =>
                    Number(product.stock || 0) === 0
                ).length}
            </h2>

            <span>Out of Stock</span>
          </div>
        </div>

      </div>

      {/* ===========================
          Toolbar
      =========================== */}

      <div className="inventory-toolbar">

        <div className="inventory-search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={warehouseFilter}
          onChange={(e) =>
            setWarehouseFilter(e.target.value)
          }
        >
          <option value="All">All Warehouses</option>

          {warehouses.map((warehouse) => (
            <option
              key={warehouse}
              value={warehouse}
            >
              {warehouse}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">All Status</option>
          <option value="Healthy">Healthy</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">
            Out of Stock
          </option>
        </select>

      </div>

      {/* ===========================
          Inventory Table
      =========================== */}

      <div className="inventory-table-card">

        <table className="inventory-table">

          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Warehouse</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {currentProducts.length > 0 ? (

              currentProducts.map((product) => {

                const status = getStockStatus(
                  product.stock
                );

                return (
                  <tr key={product.product_id}>

                    {/* Image */}

                    <td>
                      <img
                        src={
                          product.image
                            ? `http://localhost:5000${product.image}`
                            : "https://placehold.co/60x60"
                        }
                        alt={product.product_name}
                        className="inventory-product-image"
                      />
                    </td>

                    {/* Product */}

                    <td>
                      <div className="inventory-product-name">
                        <strong>
                          {product.product_name}
                        </strong>

                        <small>
                          ID: {product.product_id}
                        </small>
                      </div>
                    </td>

                    {/* Category */}

                    <td>
                      {product.category || "-"}
                    </td>

                    {/* Warehouse */}

                    <td>
                      {product.warehouse || "-"}
                    </td>

                    {/* Stock */}

                    <td>
                      <strong>
                        {Number(product.stock || 0)}
                      </strong>
                    </td>

                    {/* Status */}

                    <td>
                      <span
                        className={`inventory-status-badge ${status
                          .toLowerCase()
                          .replace(/\s/g, "-")}`}
                      >
                        {status}
                      </span>
                    </td>

                    {/* Actions */}

                    <td>
                      <div className="inventory-action-buttons">

                        <button
                          className="stock-in-btn"
                          title="Stock In"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowStockInModal(true);
                          }}
                        >
                          <FaArrowDown />
                        </button>

                        <button
                          className="stock-out-btn"
                          title="Stock Out"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowStockOutModal(true);
                          }}
                        >
                          <FaArrowUp />
                        </button>

                        

                      </div>
                    </td>

                  </tr>
                );
              })

            ) : (

              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  {loading
                    ? "Loading..."
                    : "No Inventory Found"}
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* ===========================
          Pagination
      =========================== */}

      {totalPages > 1 && (

        <div className="inventory-pagination">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, i) => (
              <button
                key={i}
                className={
                  page === i + 1
                    ? "active-page"
                    : ""
                }
                onClick={() =>
                  setPage(i + 1)
                }
              >
                {i + 1}
              </button>
            )
          )}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>

        </div>

      )}

      {/* ===========================
          Stock In Modal
      =========================== */}

      {showStockInModal && (
        <StockInModal
          product={selectedProduct}
          onClose={() => {
            setShowStockInModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            setShowStockInModal(false);
            setSelectedProduct(null);

            fetchProducts();
            fetchDashboard();
          }}
        />
      )}

      {/* ===========================
          Stock Out Modal
      =========================== */}

      {showStockOutModal && (
        <StockOutModal
          product={selectedProduct}
          onClose={() => {
            setShowStockOutModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            setShowStockOutModal(false);
            setSelectedProduct(null);

            fetchProducts();
            fetchDashboard();
          }}
        />
      )}

    </div>
  );
}

export default VendorInventory;
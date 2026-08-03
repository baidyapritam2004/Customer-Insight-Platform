import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

import {
  FaBoxes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSearch,
  FaWarehouse,
  FaRupeeSign,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "../styles/inventory.css";
import "../styles/charts.css";

function Inventory() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [vendorFilter, setVendorFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restockQty, setRestockQty] = useState("");
  const handleRestock = (product) => {
    setSelectedProduct(product);
    setRestockQty("");
  };
  const [vendors, setVendors] = useState([]);
  useEffect(() => {
    fetchProducts();
    fetchVendors();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/product/all");

      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.log(err);
      setProducts([]);
    }
  };
  const fetchVendors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/vendor/all");

      if (Array.isArray(res.data)) {
        setVendors(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const vendorLookup = useMemo(() => {
    const lookup = {};

    vendors.forEach((vendor) => {
      lookup[vendor.vendor_id] = vendor.business_name;
    });

    return lookup;
  }, [vendors]);
  // ===============================
  // Inventory Status
  // ===============================

  const getStatus = (stock) => {
    if (stock > 20)
      return {
        text: "Healthy",
        className: "healthy",
      };

    if (stock > 5)
      return {
        text: "Low Stock",
        className: "low",
      };

    return {
      text: "Critical",
      className: "danger",
    };
  };

  // ===============================
  // Category List
  // ===============================

  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((p) => p.category))];
  }, [products]);

  // ===============================
  // Filtering
  // ===============================

const filteredProducts = products.filter((product) => {
  const matchSearch = product.product_name
    ?.toLowerCase()
    .includes(search.toLowerCase());

  const matchCategory =
    categoryFilter === "All" ||
    product.category === categoryFilter;

  const status = getStatus(product.stock);

  const matchStatus =
    statusFilter === "All" ||
    status.text === statusFilter;

  const matchVendor =
    vendorFilter === "All" ||
    vendorLookup[product.vendor_id] === vendorFilter;

  return (
    matchSearch &&
    matchCategory &&
    matchStatus &&
    matchVendor
  );
});
  const vendorList = useMemo(() => {
  return [
    "All",
    ...new Set(vendors.map((v) => v.business_name)),
  ];
}, [vendors]);
  // ===============================
  // Pagination
  // ===============================

  useEffect(() => {
  setCurrentPage(1);
}, [
  search,
  categoryFilter,
  statusFilter,
  vendorFilter,
]);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // ===============================
  // Dashboard Cards
  // ===============================

  const totalProducts = products.length;

  const healthyStock = products.filter((p) => p.stock > 20).length;

  const lowStock = products.filter((p) => p.stock > 5 && p.stock <= 20).length;

  const criticalStock = products.filter((p) => p.stock <= 5).length;

  const inventoryValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0,
  );

  const averagePrice = products.length
    ? (
        products.reduce((sum, product) => sum + product.price, 0) /
        products.length
      ).toFixed(2)
    : 0;

  const lowStockProducts = products.filter((product) => product.stock <= 5);
  // ===============================
  // Inventory Chart Data
  // ===============================

  const stockChart = [
    {
      name: "Healthy",
      value: healthyStock,
    },
    {
      name: "Low Stock",
      value: lowStock,
    },
    {
      name: "Critical",
      value: criticalStock,
    },
  ];

  const categoryChart = Object.values(
    products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = {
          category: product.category,
          stock: 0,
        };
      }

      acc[product.category].stock += Number(product.stock);

      return acc;
    }, {}),
  );
  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];
  const criticalStockProducts = products.filter(
    (product) => product.stock <= 5,
  );
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="inventory-page">
          <div className="inventory-header">
            <div>
              <h1>Inventory Management</h1>

              <p>
                Monitor inventory levels, stock health and warehouse
                performance.
              </p>
            </div>
          </div>

          {/* =======================
              Summary Cards
          ======================== */}

          <div className="inventory-summary">
            <div className="inventory-card total">
              <FaBoxes />

              <div>
                <h2>{totalProducts}</h2>

                <span>Total Products</span>
              </div>
            </div>

            <div className="inventory-card healthy">
              <FaCheckCircle />

              <div>
                <h2>{healthyStock}</h2>

                <span>Healthy Stock</span>
              </div>
            </div>

            <div className="inventory-card low">
              <FaExclamationTriangle />

              <div>
                <h2>{lowStock}</h2>

                <span>Low Stock</span>
              </div>
            </div>

            <div className="inventory-card danger">
              <FaTimesCircle />

              <div>
                <h2>{criticalStock}</h2>

                <span>Critical Stock</span>
              </div>
            </div>

            <div className="inventory-card value">
              <FaRupeeSign />

              <div>
                <h2>₹{inventoryValue.toLocaleString()}</h2>

                <span>Inventory Value</span>
              </div>
            </div>

            <div className="inventory-card warehouse">
              <FaWarehouse />

              <div>
                <h2>₹{averagePrice}</h2>

                <span>Average Price</span>
              </div>
            </div>
          </div>

          {/* =======================
                Toolbar
          ======================== */}

          <div className="inventory-toolbar">
            {/* Search */}
            <div className="search-box">
              <FaSearch />

              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Healthy">Healthy</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Critical">Critical</option>
            </select>

            {/* Vendor Filter */}
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
            >
              {vendorList.map((vendor) => (
                <option key={vendor} value={vendor}>
                  {vendor}
                </option>
              ))}
            </select>
          </div>

          {/* ================= Inventory Charts ================= */}

          <div className="inventory-grid">
            <div className="chart-card">
              <h3>Inventory Status</h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stockChart}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {stockChart.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Stock by Category</h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryChart}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="category" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar dataKey="stock" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* ================= Critical Stock Alerts ================= */}

          <div className="inventory-alerts">
            <h3>🚨 Critical Stock Alerts</h3>

            {criticalStockProducts.length > 0 ? (
              <table className="alert-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Vendor</th>
                    <th>Priority</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {criticalStockProducts.map((product) => (
                    <tr key={product.product_id}>
                      <td>{product.product_name}</td>

                      <td>{product.category}</td>

                      <td>{product.stock}</td>

                      <td>
                        {vendorLookup[product.vendor_id] || "Unknown Vendor"}
                      </td>

                      <td>
                        <span className="priority critical">Immediate</span>
                      </td>

                      <td>
                        <button
                          className="restock-btn"
                          onClick={() => handleRestock(product)}
                        >
                          Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-alerts">
                All products have sufficient stock.
              </div>
            )}
          </div>
          {/* ================= Table ================= */}

          <div className="inventory-table-card">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>

                  <th>Category</th>

                  <th>Price</th>

                  <th>Stock</th>

                  <th>Status</th>

                  <th>Progress</th>

                  <th>Vendor</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => {
                    const status = getStatus(product.stock);

                    return (
                      <tr key={product.product_id}>
                        <td>{product.product_name}</td>

                        <td>{product.category}</td>

                        <td>₹{product.price}</td>

                        <td>{product.stock}</td>

                        <td>
                          <span className={`badge ${status.className}`}>
                            {status.text}
                          </span>
                        </td>

                        <td>
                          <div className="progress">
                            <div
                              className={`progress-fill ${status.className}-fill`}
                              style={{
                                width: `${Math.min(product.stock, 100)}%`,
                              }}
                            />
                          </div>
                        </td>

                        <td>
                          {vendorLookup[product.vendor_id] || "Unknown Vendor"}
                        </td>

                        <td>
                          <button className="restock-btn">Restock</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* ================= Pagination ================= */}

            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ◀ Previous
              </button>

              <span>
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>
      </div>
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="restock-modal">
            <h2>Restock Product</h2>

            <p>
              <strong>{selectedProduct.product_name}</strong>
            </p>

            <p>Current Stock :{selectedProduct.stock}</p>

            <input
              type="number"
              placeholder="Enter quantity"
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
            />

            <div className="modal-buttons">
              <button className="save-btn">Update Stock</button>

              <button
                className="cancel-btn"
                onClick={() => setSelectedProduct(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;

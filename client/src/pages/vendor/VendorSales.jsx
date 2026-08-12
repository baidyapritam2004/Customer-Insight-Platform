import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import "../../styles/vendorSales.css";

import {
  FaPlus,
  FaSearch,
  FaShoppingCart,
  FaRupeeSign,
  FaClipboardCheck,
  FaClock,
} from "react-icons/fa";

import SalesModal from "../../components/sales/SalesModal";
import DeleteSaleModal from "../../components/sales/DeleteSaleModal";
const API_URL = import.meta.env.VITE_API_URL;
function VendorSales() {
  const vendorId = localStorage.getItem("vendor_id");

  const [sales, setSales] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [paymentFilter, setPaymentFilter] = useState("All");

  const [page, setPage] = useState(1);

  const perPage = 8;

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedSale, setSelectedSale] = useState(null);
  const [dashboard, setDashboard] = useState({});
  const [products, setProducts] = useState([]);
 
 const fetchProducts = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/vendor/products/${vendorId}`
    );

    console.log("Products API:", res.data);

    setProducts(res.data);
  } catch (err) {
    console.log(err);
  }
};
  const fetchDashboard = async () => {
  if (!vendorId) return;

  try {
    const res = await axios.get(
      `${API_URL}/sales/dashboard/${vendorId}`
    );

    setDashboard(res.data);
  } catch (err) {
    console.log(err);
  }
};
  const fetchSales = () => {
    if (!vendorId) return;

    axios
      .get(`${API_URL}/sales/vendor/${vendorId}`)
      .then((res) => {
        setSales(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
  fetchDashboard();
  fetchSales();
  fetchProducts();
}, []);
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch =
        sale.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        sale.product_name?.toLowerCase().includes(search.toLowerCase()) ||
        sale.sale_id?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || sale.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" || sale.payment_method === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [sales, search, statusFilter, paymentFilter]);

  const totalPages = Math.ceil(filteredSales.length / perPage);

  const currentSales = filteredSales.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + Number(sale.total || 0),
    0,
  );

  const pendingOrders = sales.filter(
    (sale) => sale.status === "Pending",
  ).length;

  return (
    <div className="vendor-sales">
      <div className="page-header">
        <h2>Sales</h2>

        <button className="primary-btn" onClick={() => setShowAddModal(true)}>
          <FaPlus />
          New Sale
        </button>
      </div>

      {/* Dashboard */}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <FaShoppingCart />
          <h3>{dashboard.orders || 0}</h3>
          <p>Total Sales</p>
        </div>

        <div className="dashboard-card">
          <FaRupeeSign />
          <h3>₹{Number(dashboard.revenue || 0).toLocaleString()}</h3>
          <p>Revenue</p>
        </div>

        <div className="dashboard-card">
          <FaClock />
          <h3>{dashboard.pending_orders || 0}</h3>
          <p>Pending Orders</p>
        </div>

        <div className="dashboard-card">
          <FaClipboardCheck />
          <h3>{dashboard.completed_orders || 0}</h3>
          <p>Completed</p>
        </div>
      </div>

      {/* Filters */}

      <div className="toolbar">
        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search Sales..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option>All</option>
          <option>Card</option>
          <option>Cash</option>
          <option>UPI</option>
          <option>Net Banking</option>
        </select>
      </div>

      {/* Table */}

      <div className="table-card">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentSales.length > 0 ? (
              currentSales.map((sale) => (
                <tr key={sale.order_id}>
                  <td>{sale.order_id}</td>

                  <td>{sale.customer_name}</td>

                  <td>{sale.product_name}</td>

                  <td>{sale.quantity}</td>

                  <td>₹{Number(sale.total).toLocaleString()}</td>

                  <td>{sale.payment_method}</td>

                  <td>{sale.status}</td>

                  <td>{sale.date}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedSale(sale);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => {
                        setSelectedSale(sale);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  {loading ? "Loading..." : "No Sales Found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

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

      {showAddModal && (
        <SalesModal
          title="New Sale"
          sale={null}
          products={products}
          onClose={() => setShowAddModal(false)}
          onSave={async (sale) => {
            try {
              await axios.post(`${API_URL}/sales/add`, {
                ...sale,
                vendor_id: vendorId,
              });

              setShowAddModal(false);

              fetchSales();
              fetchDashboard();
            } catch (err) {
              console.log(err);
            }
          }}
        />
      )}

      {showEditModal && (
        <SalesModal
          title="Edit Sale"
          sale={selectedSale}
          products={products}
          onClose={() => setShowEditModal(false)}
          onSave={async (sale) => {
            try {
              await axios.put(
                `${API_URL}/sales/update/${selectedSale.order_id}`,
                sale,
              );

              setShowEditModal(false);

              fetchSales();
              fetchDashboard();
            } catch (err) {
              console.log(err);
            }
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteSaleModal
          sale={selectedSale}
          products={products}
          onClose={() => setShowDeleteModal(false)}
          onDelete={async () => {
            try {
              await axios.delete(
                `${API_URL}/sales/delete/${selectedSale.order_id}`,
              );

              setShowDeleteModal(false);

              fetchSales();
              fetchDashboard();
            } catch (err) {
              console.log(err);
            }
          }}
        />
      )}
    </div>
  );
}

export default VendorSales;

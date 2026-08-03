import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaRupeeSign,
  FaShoppingCart,
  FaBoxes,
  FaUsers,
  FaStar,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaWarehouse,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import "../../styles/vendorDashboard.css";

function VendorDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    summary: {},
    recent_orders: [],
    low_stock_products: [],
    monthly_revenue: [],
    order_status: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  console.log("Vendor Dashboard Mounted");
    
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("User:", user);

  if (!user || !user.vendor_id) {
    console.log("No vendor id found");
    return;
  }

  console.log("Calling API...");

  axios
    .get(`http://localhost:5000/vendor/dashboard/${user.vendor_id}`)
    .then((res) => {
      console.log("API Success:", res.data);

      setDashboard({
        summary: res.data.summary || {},
        recent_orders: res.data.recent_orders || [],
        low_stock_products: res.data.low_stock_products || [],
        monthly_revenue: res.data.monthly_revenue || [],
        order_status: res.data.order_status || [],
      });

      console.log("Setting loading false");
      setLoading(false);
    })
    .catch((err) => {
      console.log("API Error:", err);
      setLoading(false);
    });
}, []);

  

  const summary = dashboard.summary;

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="vendor-dashboard">
      {/* Header */}

      <div className="vendor-header">
        <div>
          <h1>Vendor Dashboard</h1>

          <p>Welcome back! Here's an overview of your business performance.</p>
        </div>
      </div>

      {/* KPI Cards */}

      <div className="vendor-summary">
        <div className="summary-card revenue">
          <FaRupeeSign />

          <div>
            <h2>₹{Number(summary.revenue || 0).toLocaleString()}</h2>

            <span>Total Revenue</span>
          </div>
        </div>

        <div className="summary-card orders">
          <FaShoppingCart />

          <div>
            <h2>{summary.orders || 0}</h2>

            <span>Total Orders</span>
          </div>
        </div>

        <div className="summary-card products">
          <FaBoxes />

          <div>
            <h2>{summary.products || 0}</h2>

            <span>Total Products</span>
          </div>
        </div>

        <div className="summary-card customers">
          <FaUsers />

          <div>
            <h2>{summary.customers || 0}</h2>

            <span>Customers</span>
          </div>
        </div>

        <div className="summary-card rating">
          <FaStar />

          <div>
            <h2>{summary.rating || 0}</h2>

            <span>Average Rating</span>
          </div>
        </div>

        <div className="summary-card pending">
          <FaClock />

          <div>
            <h2>{summary.pending_orders || 0}</h2>

            <span>Pending Orders</span>
          </div>
        </div>

        <div className="summary-card delivered">
          <FaCheckCircle />

          <div>
            <h2>{summary.delivered_orders || 0}</h2>

            <span>Delivered Orders</span>
          </div>
        </div>

        <div className="summary-card stock">
          <FaExclamationTriangle />

          <div>
            <h2>{summary.low_stock || 0}</h2>

            <span>Low Stock</span>
          </div>
        </div>
      </div>
      {/* ================= Charts ================= */}

      <div className="vendor-chart-grid">
        {/* Revenue Trend */}

        <div className="chart-card">
          <h3>Monthly Revenue</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboard.monthly_revenue}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status */}

        <div className="chart-card">
          <h3>Order Status</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboard.order_status}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {dashboard.order_status.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= Tables ================= */}

      <div className="vendor-table-grid">
        {/* Recent Orders */}

        <div className="table-card">
          <h3>Recent Orders</h3>

          <table className="vendor-table">
            <thead>
              <tr>
                <th>Order ID</th>

                <th>Customer</th>

                <th>Product</th>

                <th>Total</th>

                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {dashboard.recent_orders.length > 0 ? (
                dashboard.recent_orders.map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>

                    <td>{order.customer_name}</td>

                    <td>{order.product_name}</td>

                    <td>₹{Number(order.total).toLocaleString()}</td>

                    <td>
                      <span
                        className={`status-badge ${order.status
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Low Stock Products */}

        <div className="table-card">
          <h3>Low Stock Products</h3>

          <table className="vendor-table">
            <thead>
              <tr>
                <th>Product</th>

                <th>Category</th>

                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {dashboard.low_stock_products.length > 0 ? (
                dashboard.low_stock_products.map((product) => (
                  <tr key={product.product_id}>
                    <td>{product.product_name}</td>

                    <td>{product.category}</td>

                    <td>
                      <span className="critical-stock">{product.stock}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No low stock products.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* ================= Quick Actions ================= */}

      <div className="quick-actions">
        <h2>Quick Actions</h2>

        <div className="action-grid">
          <div
            className="action-card"
            onClick={() => navigate("/vendor/products")}
          >
            <FaBoxes />

            <h3>Manage Products</h3>

            <p>Add, edit or remove products.</p>
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/vendor/orders")}
          >
            <FaShoppingCart />

            <h3>Orders</h3>

            <p>Track and manage customer orders.</p>
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/vendor/inventory")}
          >
            <FaWarehouse />

            <h3>Inventory</h3>

            <p>Monitor stock levels and restock.</p>
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/vendor/sales")}
          >
            <FaRupeeSign />

            <h3>Sales Report</h3>

            <p>View revenue and sales analytics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

import {
  FaShoppingCart,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaSearch,
  FaRupeeSign,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import "../styles/orders.css";
const API_URL = import.meta.env.VITE_API_URL;
function Orders() {

  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchOrders();
    fetchVendors();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/order/all`);

      if (Array.isArray(res.data))
        setOrders(res.data);
      else
        setOrders([]);

    } catch (err) {
      console.log(err);
    }
  };

  const fetchVendors = async () => {

    try {

      const res = await axios.get(`${API_URL}/vendor/all`);

      if (Array.isArray(res.data))
        setVendors(res.data);

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

  const updateStatus = async (orderId, status) => {

    try {

      await axios.put(
        `${API_URL}/order/status/${orderId}`,
        {
          status,
        }
      );

      fetchOrders();

    } catch (err) {
      console.log(err);
    }
  };

  const deleteOrder = async (orderId) => {

    if (!window.confirm("Delete this order?")) return;

    try {

      await axios.delete(
        `${API_URL}/order/delete/${orderId}`
      );

      fetchOrders();

    } catch (err) {
      console.log(err);
    }
  };

  const filteredOrders = orders.filter((order) => {

    const searchMatch =
      order.customer_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      order.product_name
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "All" ||
      order.status === statusFilter;

    return searchMatch && statusMatch;

  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.ceil(
    filteredOrders.length / rowsPerPage
  );

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalOrders = orders.length;

  const pendingOrders =
    orders.filter(
      (o) => o.status === "Pending"
    ).length;

  const shippedOrders =
    orders.filter(
      (o) => o.status === "Shipped"
    ).length;

  const deliveredOrders =
    orders.filter(
      (o) => o.status === "Delivered"
    ).length;

  const totalRevenue =
    orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );

  const getBadge = (status) => {

    switch (status) {

      case "Pending":
        return "pending";

      case "Processing":
        return "processing";

      case "Packed":
        return "packed";

      case "Shipped":
        return "shipped";

      case "Delivered":
        return "delivered";

      case "Cancelled":
        return "cancelled";

      default:
        return "";
    }
  };
const orderStatusChart = [
  {
    name: "Pending",
    value: pendingOrders,
  },
  {
    name: "Shipped",
    value: shippedOrders,
  },
  {
    name: "Delivered",
    value: deliveredOrders,
  },
  {
    name: "Cancelled",
    value: orders.filter(
      (o) => o.status === "Cancelled"
    ).length,
  },
];

const COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#ef4444",
];
const [revenueChart, setRevenueChart] = useState([]);

useEffect(() => {
    axios
        .get(`${API_URL}/order/monthly-revenue`)
        .then(res => setRevenueChart(res.data));
}, []);
const [dailyOrders, setDailyOrders] = useState([]);

useEffect(() => {
    axios
        .get(`${API_URL}/order/daily-orders`)
        .then(res => setDailyOrders(res.data));
}, []);
  return (

    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <div className="orders-page">

          <div className="orders-header">

            <h1>Order Management</h1>

            <p>
              Manage all customer orders and deliveries.
            </p>

          </div>

          <div className="orders-summary">

            <div className="order-card">
              <FaShoppingCart />
              <div>
                <h2>{totalOrders}</h2>
                <span>Total Orders</span>
              </div>
            </div>

            <div className="order-card pending">
              <FaClock />
              <div>
                <h2>{pendingOrders}</h2>
                <span>Pending</span>
              </div>
            </div>

            <div className="order-card shipped">
              <FaTruck />
              <div>
                <h2>{shippedOrders}</h2>
                <span>Shipped</span>
              </div>
            </div>

            <div className="order-card delivered">
              <FaCheckCircle />
              <div>
                <h2>{deliveredOrders}</h2>
                <span>Delivered</span>
              </div>
            </div>

            <div className="order-card revenue">
              <FaRupeeSign />
              <div>
                <h2>
                  ₹{totalRevenue.toLocaleString()}
                </h2>
                <span>Total Revenue</span>
              </div>
            </div>

          </div>
<div className="orders-grid">

    {/* Revenue */}

    <div className="chart-card">

        <h3>Revenue Trend</h3>

        <ResponsiveContainer width="100%" height={300}>

            <LineChart data={revenueChart}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                />

            </LineChart>

        </ResponsiveContainer>

    </div>

    {/* Status */}

    <div className="chart-card">

        <h3>Order Status</h3>

        <ResponsiveContainer width="100%" height={300}>

            <PieChart>

                <Pie
                    data={orderStatusChart}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                >

                    {orderStatusChart.map((entry,index)=>(

                        <Cell
                            key={index}
                            fill={COLORS[index]}
                        />

                    ))}

                </Pie>

                <Tooltip/>

                <Legend/>

            </PieChart>

        </ResponsiveContainer>

    </div>

</div>

<div className="chart-card">

    <h3>Orders Per Day</h3>

    <ResponsiveContainer width="100%" height={300}>

        <BarChart data={dailyOrders}>

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="day"/>

            <YAxis/>

            <Tooltip/>

            <Bar
                dataKey="orders"
                fill="#0dd3f7"
            />

        </BarChart>

    </ResponsiveContainer>

</div>
          <div className="orders-toolbar">

            <div className="search-box">

              <FaSearch />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >

              <option>All</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Packed</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>

            </select>

          </div>

          <div className="orders-table-card">

            <table>

              <thead>

                <tr>

                  <th>ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Vendor</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {currentOrders.length > 0 ? (

                  currentOrders.map((order) => (

                    <tr key={order.order_id}>

                      <td>{order.order_id}</td>

                      <td>{order.customer_name}</td>

                      <td>{order.product_name}</td>

                      <td>
                        {vendorLookup[order.vendor_id] ||
                          "Unknown"}
                      </td>

                      <td>{order.quantity}</td>

                      <td>₹{order.total}</td>

                      <td>{order.payment_method}</td>

                      <td>{order.date}</td>

                      <td>

                        <select
                          className={`status-select ${getBadge(order.status)}`}
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(
                              order.order_id,
                              e.target.value
                            )
                          }
                        >

                          <option>Pending</option>
                          <option>Processing</option>
                          <option>Packed</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>

                        </select>

                      </td>

                      <td>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteOrder(order.order_id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="10"
                      style={{ textAlign: "center" }}
                    >
                      No orders found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

            <div className="pagination">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(currentPage - 1)
                }
              >
                ◀ Previous
              </button>

              <span>
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                disabled={
                  currentPage === totalPages ||
                  totalPages === 0
                }
                onClick={() =>
                  setCurrentPage(currentPage + 1)
                }
              >
                Next ▶
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Orders;
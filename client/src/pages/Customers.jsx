import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import "../styles/customers.css";

import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import CustomerGrowth from "../components/dashboard/charts/CustomerGrowth";
import CustomerSegment from "../components/dashboard/charts/CustomerSegment";
import ChartCard from "../components/dashboard/ChartCard";
const API_URL = import.meta.env.VITE_API_URL;
function Customers() {
  const [summary, setSummary] = useState({});
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
const [dashboard, setDashboard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
  loadSummary();
  loadCustomers();
  loadDashboard();
}, []);
const loadDashboard = async () => {
  try {
    const res = await axios.get(`${API_URL}/dashboard`);
    setDashboard(res.data);
  } catch (err) {
    console.log(err);
  }
};
  const loadSummary = async () => {
    try {
      const res = await axios.get(`${API_URL}/customer/summary`);
      setSummary(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await axios.get(`${API_URL}/customer/all`);
      setCustomers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const states = useMemo(() => {
    return ["All", ...new Set(customers.map((c) => c.state))];
  }, [customers]);

  const filteredCustomers = customers.filter((customer) => {
    const matchSearch =
      customer.customer_id.toLowerCase().includes(search.toLowerCase()) ||
      customer.customer_name.toLowerCase().includes(search.toLowerCase());

    const matchState = stateFilter === "All" || customer.state === stateFilter;

    return matchSearch && matchState;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, stateFilter]);

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentCustomers = filteredCustomers.slice(
    indexOfFirstRow,
    indexOfLastRow,
  );

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="customers-page">
          {/* Your existing page content starts here */}

          <h2 className="page-title">Customer Management</h2>

          {/* Summary Cards */}

          <div className="customer-cards">
            <div className="customer-card">
              <h4>Total Customers</h4>
              <h2>{summary.total_customers || 0}</h2>
            </div>

            <div className="customer-card">
              <h4>Repeat Customers</h4>
              <h2>{summary.repeat_customers || 0}</h2>
            </div>

            <div className="customer-card">
              <h4>Average Orders</h4>
              <h2>{summary.average_orders || 0}</h2>
            </div>

            <div className="customer-card">
              <h4>Top Customer</h4>
              <h2>{summary.top_customer || "-"}</h2>
            </div>
          </div>

          {/* Toolbar */}

          <div className="customer-toolbar">
            <input
              type="text"
              placeholder="Search Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer ID</th>

                  <th>Name</th>

                  <th>City</th>

                  <th>State</th>

                  <th>Orders</th>

                  <th>Items</th>

                  <th>Total Spent</th>
                </tr>
              </thead>

              <tbody>
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer) => (
                    <tr key={customer.customer_id}>
                      <td>{customer.customer_id}</td>

                      <td>{customer.customer_name}</td>

                      <td>{customer.city}</td>

                      <td>{customer.state}</td>

                      <td>{customer.total_orders}</td>

                      <td>{customer.items_purchased}</td>

                      <td>₹{customer.total_spent.toLocaleString("en-IN")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "25px",
                      }}
                    >
                      No Customers Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}

            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ◀ Previous
              </button>

              <span>
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>
        {/* Charts */}

        <div className="customer-charts">

  <ChartCard title="Customer Growth">
    <CustomerGrowth
      data={dashboard?.charts?.customer_growth || []}
    />
  </ChartCard>

  <ChartCard title="Customer Segmentation">
    <CustomerSegment
      data={dashboard?.charts?.customer_segments || []}
    />
  </ChartCard>

</div>
      </div>
    </div>
  );
}

export default Customers;

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

import "../styles/vendors.css";
const API_URL = import.meta.env.VITE_API_URL;
function Vendors() {
  const [vendors, setVendors] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    loadVendors();
  }, []);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
  axios
    .get(`${API_URL}/vendor/performance`)
    .then((res) => {
      console.log("Vendor Performance:", res.data);
      setPerformance(res.data);
    })
    .catch((err) => {
      console.error("Vendor Performance Error:", err);
      console.error("Status:", err.response?.status);
      console.error("Response:", err.response?.data);
    });
}, []);
  const loadVendors = async () => {
  try {
    console.log("API URL:", API_URL);

    const res = await axios.get(`${API_URL}/vendor/all`);

    console.log("Vendor API Response:", res.data);

    setVendors(res.data);
  } catch (err) {
    console.error("Vendor API Error:", err);
    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);
  }
};

  const statuses = useMemo(() => {
    return ["All", ...new Set(vendors.map((v) => v.status))];
  }, [vendors]);

  const filteredVendors = vendors.filter((vendor) => {
    const matchSearch =
  (vendor.business_name || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||
  (vendor.owner_name || "")
    .toLowerCase()
    .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || vendor.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredVendors.length / rowsPerPage);

  const currentVendors = filteredVendors.slice(
    (currentPage - 1) * rowsPerPage,

    currentPage * rowsPerPage,
  );

  const active = vendors.filter((v) => v.status === "Active").length;

  const pending = vendors.filter((v) => v.status === "Pending").length;

  const totalCommission = vendors.reduce(
    (sum, v) => sum + Number(v.commission),

    0,
  );

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="vendors-page">
          <h2 className="page-title">Vendor Management</h2>

          <div className="vendor-cards">
            <div className="vendor-card">
              <h4>Total Vendors</h4>

              <h2>{vendors.length}</h2>
            </div>

            <div className="vendor-card">
              <h4>Active</h4>

              <h2>{active}</h2>
            </div>

            <div className="vendor-card">
              <h4>Pending</h4>

              <h2>{pending}</h2>
            </div>

            <div className="vendor-card">
              <h4>Avg Commission</h4>

              <h2>
                {vendors.length
                  ? (totalCommission / vendors.length).toFixed(1)
                  : 0}
                %
              </h2>
            </div>
          </div>

          <div className="vendor-toolbar">
            <input
              type="text"
              placeholder="Search Vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Business</th>

                  <th>Owner</th>

                  <th>Status</th>

                  <th>Commission</th>
                </tr>
              </thead>

              <tbody>
                {currentVendors.map((vendor) => (
                  <tr key={vendor.vendor_id}>
                    <td>{vendor.business_name}</td>

                    <td>{vendor.owner_name}</td>

                    <td>
                      <span
                        className={`status-badge ${(vendor.status || "").toLowerCase()}`}
                      >
                        {vendor.status}
                      </span>
                    </td>

                    <td>{vendor.commission}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ◀ Previous
              </button>

              <span>
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next ▶
              </button>
            </div>
          </div>

          <h2 className="section-title">Vendor Performance</h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>

                  <th>Vendor</th>

                  <th>Revenue</th>

                  <th>Orders</th>

                  <th>Rating</th>

                  <th>Score</th>
                </tr>
              </thead>

              <tbody>
                {performance.map((v) => (
                  <tr key={v.vendor_id}>
                    <td>

{v.rank===1 && "🥇"}

{v.rank===2 && "🥈"}

{v.rank===3 && "🥉"}

{v.rank>3 && `#${v.rank}`}

</td>

                    <td>{v.business_name}</td>

                    <td>₹{Number(v.revenue || 0).toLocaleString("en-IN")}</td>

                    <td>{v.orders}</td>

                    <td>
                      <span
                        className={Number(v.average_rating || 0) >= 4.5
                          ? "rating-good"
                          : Number(v.average_rating || 0) >= 3
                            ? "rating-average"
                            : "rating-poor"
                        }
                      >
                        ⭐ {v.average_rating}
                      </span>
                    </td>
                    <td>
                      <span className="score-badge">{v.performance_score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
     
      <div className="vendor-cards">
        <div className="vendor-card">
          <h4>Top Vendor</h4>
          <h2>{performance.length ? performance[0].business_name : "-"}</h2>
        </div>

        <div className="vendor-card">
          <h4>Total Revenue</h4>
          <h2>
            ₹
            {performance
  .reduce((a, b) => a + Number(b.revenue || 0), 0)
  .toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="vendor-card">
          <h4>Total Orders</h4>
          <h2>{performance.reduce((a, b) => a + Number(b.orders || 0), 0)}</h2>
        </div>

        <div className="vendor-card">
          <h4>Average Rating</h4>
          <h2>
            {performance.length
              ? (
                  performance.reduce((a, b) => a + Number(b.average_rating || 0), 0) /
                  performance.length
                ).toFixed(1)
              : 0}
            ⭐
          </h2>
        </div>
      </div>
    </div></div> </div>
  );
}

export default Vendors;

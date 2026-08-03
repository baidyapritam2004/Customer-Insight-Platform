import { useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

import "../styles/reports.css";

function Reports() {

  const [generating, setGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const generateReport = () => {

    setGenerating(true);

    setReportReady(false);

    setTimeout(() => {

      setGenerating(false);

      setReportReady(true);

    }, 2000);

  };

  const downloadPDF = () => {
    window.open("http://localhost:5000/export/pdf", "_blank");
  };

  const downloadCSV = () => {
    window.open("http://localhost:5000/export/csv", "_blank");
  };

  const downloadExcel = () => {
    window.open("http://localhost:5000/export/excel", "_blank");
  };

  const reports = [

    {
      title: "Customer Insight Report",
      description:
        "Customer behaviour, purchase history, spending analysis and segmentation."
    },

    {
      title: "Sales Report",
      description:
        "Revenue, sales trend, state-wise and city-wise performance."
    },

    {
      title: "Inventory Report",
      description:
        "Inventory value, stock availability and low stock analysis."
    },

    {
      title: "Vendor Performance",
      description:
        "Vendor sales, supplied products and overall contribution."
    }

  ];

  return (

    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <div className="reports-page">

          <h2 className="page-title">
            Reports Center
          </h2>

          {/* Summary Cards */}

          <div className="report-summary">

            <div className="summary-card">
              <h4>Available Reports</h4>
              <h2>{reports.length}</h2>
            </div>

            <div className="summary-card">
              <h4>Export Formats</h4>
              <h2>PDF / CSV / XLSX</h2>
            </div>

            <div className="summary-card">
              <h4>Dataset</h4>
              <h2>latest.csv</h2>
            </div>

            <div className="summary-card">
              <h4>Status</h4>
              <h2>{reportReady ? "Ready" : "Pending"}</h2>
            </div>

          </div>

          {generating && (

            <div className="report-loader">

              <div className="loader"></div>

              <h3>Generating AI Report...</h3>

            </div>

          )}

          {/* Report Cards */}

          <div className="report-grid">

            {reports.map((report) => (

              <div
                className="report-card"
                key={report.title}
              >

                <h3>{report.title}</h3>

                <p>{report.description}</p>

                <div className="report-buttons">

                  {!reportReady ? (

                    <button
                      className="generate-btn"
                      onClick={generateReport}
                      disabled={generating}
                    >

                      {generating
                        ? "Generating..."
                        : "Generate Report"}

                    </button>

                  ) : (

                    <>

                      <button
                        className="pdf-btn"
                        onClick={downloadPDF}
                      >
                        PDF
                      </button>

                      <button
                        className="csv-btn"
                        onClick={downloadCSV}
                      >
                        CSV
                      </button>

                      <button
                        className="excel-btn"
                        onClick={downloadExcel}
                      >
                        Excel
                      </button>

                    </>

                  )}

                </div>

              </div>

            ))}

          </div>

          {/* AI Summary */}

          <div className="ai-summary">

            <h3>AI Business Summary</h3>

            <ul>

              <li>Customer retention has improved over previous periods.</li>

              <li>Electronics is the highest revenue generating category.</li>

              <li>Several inventory items require replenishment.</li>

              <li>Premium customers contribute most of the total revenue.</li>

              <li>Sales forecast indicates positive growth for next month.</li>

            </ul>

          </div>

          {/* History */}

          <div className="history-table">

            <h3>Recent Reports</h3>

            <table>

              <thead>

                <tr>

                  <th>Report</th>

                  <th>Generated</th>

                  <th>Formats</th>

                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>Customer Report</td>

                  <td>Today</td>

                  <td>PDF, CSV, XLSX</td>

                  <td>Ready</td>

                </tr>

                <tr>

                  <td>Sales Report</td>

                  <td>Today</td>

                  <td>PDF, CSV, XLSX</td>

                  <td>Ready</td>

                </tr>

                <tr>

                  <td>Inventory Report</td>

                  <td>Today</td>

                  <td>PDF, CSV, XLSX</td>

                  <td>Ready</td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Reports;
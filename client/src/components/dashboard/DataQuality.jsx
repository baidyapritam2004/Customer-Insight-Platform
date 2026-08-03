import {
    FaCheckCircle,
    FaDatabase,
    FaCopy,
    FaExclamationTriangle,
    FaTable
} from "react-icons/fa";

import "../../styles/dataquality.css";

function DataQuality({ summary }) {

    console.log("Summary:", summary);

    if (!summary) return null;

    const score = Number(summary.quality_score) || 0;

    return (

        <div className="quality-card">

            <div className="quality-header">

                <div>

                    <h2>Data Cleaning Report</h2>

                    <p>Automatic quality assessment of the uploaded dataset</p>

                </div>

                <div className="quality-score">

                    {score}%

                </div>

            </div>

            <div className="quality-progress">

                <div
                    className="quality-progress-fill"
                    style={{ width: `${score}%` }}
                ></div>

            </div>

            <div className="quality-grid">

                <div className="quality-item">

                    <FaDatabase />

                    <h3>{summary.total_rows}</h3>

                    <p>Total Rows</p>

                </div>

                <div className="quality-item">

                    <FaTable />

                    <h3>{summary.total_columns}</h3>

                    <p>Total Columns</p>

                </div>

                <div className="quality-item">

                    <FaExclamationTriangle />

                    <h3>{summary.missing_values}</h3>

                    <p>Missing Values</p>

                </div>

                <div className="quality-item">

                    <FaCopy />

                    <h3>{summary.duplicate_rows}</h3>

                    <p>Duplicate Rows</p>

                </div>

            </div>

            <div className="quality-status">

                <FaCheckCircle />

                {
                    score >= 90
                        ? "Excellent data quality."
                        : score >= 75
                        ? "Good data quality. Minor cleaning recommended."
                        : "Poor data quality. Cleaning is required."
                }

            </div>

        </div>

    );

}

export default DataQuality;
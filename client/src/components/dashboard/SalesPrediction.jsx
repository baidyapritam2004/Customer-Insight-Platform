import {
    FaArrowUp,
    FaRobot,
    FaCalendarAlt,
    FaCheckCircle
} from "react-icons/fa";

import "../../styles/prediction.css";

function PredictionCard({ prediction }) {

    if (!prediction) return null;

    return (

        <div className="prediction-card">

            <div className="prediction-header">

                <h2>📈 Sales Forecast</h2>

                <span className="model-badge">

                    <FaRobot />

                    {prediction.model}

                </span>

            </div>

            <div className="prediction-value">

                ₹{Number(prediction.next_month_sales).toLocaleString("en-IN")}

            </div>

            <p className="prediction-subtitle">

                Predicted Revenue

            </p>

            <div className="growth-box">

                <FaArrowUp />

                <span>

                    {prediction.growth >= 0 ? "+" : ""}

                    {prediction.growth}% vs Last Month

                </span>

            </div>

            <div className="confidence-section">

                <div className="confidence-header">

                    <span>Confidence</span>

                    <span>{prediction.confidence}%</span>

                </div>

                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{ width: `${prediction.confidence}%` }}
                    ></div>

                </div>

            </div>

            <div className="prediction-footer">

                <div>

                    <FaCalendarAlt />

                    <span>{prediction.period}</span>

                </div>

                <div>

                    <FaCheckCircle />

                    <span>{prediction.updated}</span>

                </div>

            </div>

        </div>

    );

}

export default PredictionCard;
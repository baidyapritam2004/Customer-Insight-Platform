import {
    FaBoxOpen,
    FaTags,
    FaArrowUp,
    FaArrowDown,
    FaStar
} from "react-icons/fa";

import "../../styles/summary.css";

function DashboardSummary({ data }) {

    if (!data) return null;

    return (

        <div className="summary-card">

            <h2>Dashboard Summary</h2>

            <div className="summary-grid">

                <div className="summary-item">

                    <div className="summary-icon blue">
                        <FaBoxOpen />
                    </div>

                    <div>

                        <h3>{data.products}</h3>

                        <p>Total Products</p>

                    </div>

                </div>

                <div className="summary-item">

                    <div className="summary-icon green">
                        <FaTags />
                    </div>

                    <div>

                        <h3>{data.categories}</h3>

                        <p>Categories</p>

                    </div>

                </div>

                <div className="summary-item">

                    <div className="summary-icon orange">
                        <FaArrowUp />
                    </div>

                    <div>

                        <h3>₹{Number(data.highest_price).toLocaleString()}</h3>

                        <p>Highest Price</p>

                    </div>

                </div>

                <div className="summary-item">

                    <div className="summary-icon red">
                        <FaArrowDown />
                    </div>

                    <div>

                        <h3>₹{Number(data.lowest_price).toLocaleString()}</h3>

                        <p>Lowest Price</p>

                    </div>

                </div>

                <div className="summary-item">

                    <div className="summary-icon yellow">
                        <FaStar />
                    </div>

                    <div>

                        <h3>{data.average_rating} ★</h3>

                        <p>Average Rating</p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default DashboardSummary;
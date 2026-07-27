import { useEffect, useState } from "react";
import axios from "axios";

function VendorDashboard() {

    const [dashboard, setDashboard] = useState({});

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"));

        axios
            .get(`http://localhost:5000/vendor/dashboard/${user.vendor_id}`)
            .then((res) => setDashboard(res.data))
            .catch((err) => console.log(err));

    }, []);

    return (

        <div className="dashboard-page">

            <h1>Vendor Dashboard</h1>

            <div className="dashboard-cards">

                <div className="card">
                    <h3>Revenue</h3>
                    <h2>₹ {dashboard.revenue || 0}</h2>
                </div>

                <div className="card">
                    <h3>Products</h3>
                    <h2>{dashboard.products || 0}</h2>
                </div>

                <div className="card">
                    <h3>Orders</h3>
                    <h2>{dashboard.orders || 0}</h2>
                </div>

                <div className="card">
                    <h3>Low Stock</h3>
                    <h2>{dashboard.low_stock || 0}</h2>
                </div>

            </div>

        </div>

    );
}

export default VendorDashboard;
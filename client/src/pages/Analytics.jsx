import DashboardLayout from "../components/dashboard/DashboardLayout";
import AnalyticsHeader from "../components/dashboard/analytics/AnalyticsHeader";
import SalesByCategory from "../components/dashboard/analytics/SalesByCategory";
import TopProducts from "../components/dashboard/analytics/TopProducts";
import api from "../api/api";
import { useEffect, useState } from "react";

import "../styles/analytics.css";

function Analytics() {

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

        api.get("/dashboard")
            .then(res => setDashboard(res.data))
            .catch(console.error);

    }, []);

    if (!dashboard)
        return <h2>Loading...</h2>;

    return (

        <DashboardLayout>

            <AnalyticsHeader />

            <SalesByCategory
    data={dashboard.charts.category_sales}
/>

<TopProducts
    data={dashboard.top_products}
/>

        </DashboardLayout>

    );

}

export default Analytics;
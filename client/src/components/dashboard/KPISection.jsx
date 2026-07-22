import {
    FaUsers,
    FaRupeeSign,
    FaChartLine,
    FaTags
} from "react-icons/fa";

import KPICard from "./KPICard";

function KPISection({ data }) {

    if (!data) return null;

    return (

        <div className="dashboard-grid">

            <KPICard
                icon={<FaUsers />}
                title="Total Customers"
                value={data.total_customers}
                subtitle="Customers in the dataset"
                trend={`${data.customer_growth}%`}
                trendType={data.customer_growth >= 0 ? "up" : "down"}
            />

            <KPICard
                icon={<FaRupeeSign />}
                title="Total Sales"
                value={`₹${Number(data.total_sales).toLocaleString()}`}
                subtitle="Total revenue generated"
                trend={`${data.sales_growth}%`}
                trendType={data.sales_growth >= 0 ? "up" : "down"}
            />

            <KPICard
                icon={<FaChartLine />}
                title="Average Sale"
                value={`₹${Number(data.average_sale).toFixed(2)}`}
                subtitle="Average sale value"
                trend={`${data.average_growth}%`}
                trendType={data.average_growth >= 0 ? "up" : "down"}
            />

            <KPICard
                icon={<FaTags />}
                title="Top Category"
                value={data.top_category}
                subtitle="Best performing category"
                trend="Top"
                trendType="neutral"
            />

        </div>

    );
}

export default KPISection;
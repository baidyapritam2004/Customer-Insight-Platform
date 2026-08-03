import { useState, useEffect } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import api from "../api/api";

import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import KPISection from "../components/dashboard/KPISection";

import RevenueChart from "../components/dashboard/charts/RevenueChart";
import CustomerSegment from "../components/dashboard/charts/CustomerSegment";
import CustomerGrowth from "../components/dashboard/charts/CustomerGrowth";
import ProductCategory from "../components/dashboard/charts/ProductCategory";
import CustomerTable from "../components/dashboard/tables/CustomerTable";
import AIInsights from "../components/dashboard/AIInsights";
import FilterBar from "../components/dashboard/FilterBar";
import DataQuality from "../components/dashboard/DataQuality";
import DataPreview from "../components/dashboard/DataPreview";
import DataCleaningSummary from "../components/dashboard/DataCleaningSummary";
import SalesByState from "../components/dashboard/charts/SalesByState";
import SalesByCity from "../components/dashboard/charts/SalesByCity";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import TopProducts from "../components/dashboard/TopProducts";
import ExportButtons from "../components/dashboard/ExportButtons";
import AIRecommendations from "../components/dashboard/AIRecommendations";
import SalesPrediction from "../components/dashboard/SalesPrediction";
import ChartCard from "../components/dashboard/ChartCard";
import DatasetInfo from "../components/dashboard/DatasetInfo";


import "../styles/charts.css";
import "../styles/table.css";
import "../styles/filterbar.css";
import "../styles/dataquality.css";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    api
      .get("/dashboard", {
        params: {
          category: selectedCategory,
        },
      })
      .then((res) => {

    console.log("Dashboard Response:", res.data);

    console.log("Cleaning Summary:", res.data.cleaning_summary);

    setDashboard(res.data);

})
      .catch((err) => console.error(err));
  }, [selectedCategory]);

  if (!dashboard) {
    return <h2>Loading Dashboard...</h2>;
  }

  const customers = dashboard.customers || [];

  const categories = ["All", ...(dashboard.categories || [])];
  const filteredCustomers = [...customers]
    .filter((customer) =>
      (customer["Product Name"] || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.Price - b.Price;

        case "price-high":
          return b.Price - a.Price;

        case "rating-low":
          return a.Rating - b.Rating;

        case "rating-high":
          return b.Rating - a.Rating;

        case "name":
          return (a["Product Name"] || "").localeCompare(
            b["Product Name"] || "",
          );

        default:
          return 0;
      }
    });

  return (
  <DashboardLayout

    dashboardInfo={dashboard.dashboard_info}

>
      <div className="dashboard">
        <WelcomeBanner />

        <div id="dashboard-report">
          <DatasetInfo

    info={dashboard.dashboard_info}

    cleaning={dashboard.cleaning_summary}

/>
          
          <DataPreview data={dashboard.preview} />
           <div className="table-card">
            <DataQuality summary={dashboard.cleaning_summary} />
          </div>

          <KPISection data={dashboard.kpis} />

          <div className="two-column">
            <DashboardSummary data={dashboard.summary} />
            <SalesPrediction prediction={dashboard.prediction} />
          </div>

          <div className="dashboard-grid">
            <ChartCard title="Revenue Trend">
              <RevenueChart data={dashboard.charts?.revenue_trend || []} />
            </ChartCard>

            <ChartCard title="Customer Growth">
              <CustomerGrowth data={dashboard.charts?.customer_growth || []} />
            </ChartCard>
          </div>

          <div className="dashboard-grid">
            <ChartCard title="Customer Segmentation">
              <CustomerSegment
                data={dashboard.charts?.customer_segments || []}
              />
            </ChartCard>

            <ChartCard title="Category Sales">
              <ProductCategory
                data={dashboard.charts?.category_sales || []}
                onSelectCategory={setSelectedCategory}
              />
            </ChartCard>
          </div>

          <div className="dashboard-grid">
            <ChartCard title="Sales by State">
              <SalesByState data={dashboard.charts?.sales_by_state || []} />
            </ChartCard>

            <ChartCard title="Sales by City">
              <SalesByCity data={dashboard.charts?.sales_by_city || []} />
            </ChartCard>
          </div>
          <div className="table-card">
            <TopProducts data={dashboard.top_products} />
          </div>

          <FilterBar
            categories={categories}
            onFilter={setSelectedCategory}
            onSearch={setSearchTerm}
            onSort={setSortBy}
          />

          <div className="table-card">
            <CustomerTable data={filteredCustomers} />
          </div>

         
          <div className="table-card">
            <AIInsights data={dashboard.insights || []} />
          </div>
          <div className="table-card">
            <AIRecommendations data={dashboard.recommendations || []} />
          </div>
        </div>

        <ExportButtons data={filteredCustomers} />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../../styles/dashboard.css";

function DashboardLayout({ children, dashboardInfo }) {
  return (
    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar info={dashboardInfo} />

        <main className="dashboard-main">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;
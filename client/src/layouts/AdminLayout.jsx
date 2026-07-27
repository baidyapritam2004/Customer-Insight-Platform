import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
    return (
        <>
            <Sidebar />
            <Navbar />
            <div className="main-content">
                <Outlet />
            </div>
        </>
    );
}

export default AdminLayout;
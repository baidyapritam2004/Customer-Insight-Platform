import VendorNavbar from "../components/vendor/VendorNavbar";
import VendorSidebar from "../components/vendor/VendorSidebar";
import { Outlet } from "react-router-dom";

function VendorLayout() {
    return (
        <>
            <VendorSidebar />
            <VendorNavbar />
            <div className="main-content">
                <Outlet />
            </div>
        </>
    );
}

export default VendorLayout;
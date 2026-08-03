import { Outlet } from "react-router-dom";

import VendorSidebar from "./VendorSidebar";
import VendorNavbar from "./VendorNavbar";

import "../../styles/layout.css";

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
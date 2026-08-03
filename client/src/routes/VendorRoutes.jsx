import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import VendorLayout from "../components/vendor/VendorLayout";

import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorProducts from "../pages/vendor/VendorProducts";
import VendorInventory from "../pages/vendor/VendorInventory";
import VendorSales from "../pages/vendor/VendorSales";
import VendorProfile from "../pages/vendor/VendorProfile";

function VendorRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <VendorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="products" element={<VendorProducts />} />
        <Route path="inventory" element={<VendorInventory />} />
        <Route path="sales" element={<VendorSales />} />
        <Route path="profile" element={<VendorProfile />} />
      </Route>
    </Routes>
  );
}

export default VendorRoutes;
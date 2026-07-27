import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import VendorDashboard from "../pages/VendorDashboard";
import VendorProducts from "../pages/VendorProducts";
import VendorInventory from "../pages/VendorInventory";
import VendorSales from "../pages/VendorSales";
import VendorProfile from "../pages/VendorProfile";

function VendorRoutes() {
    return (
        <Routes>

            <Route
                path="/vendor/dashboard"
                element={
                    <ProtectedRoute role="Vendor">
                        <VendorDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vendor/products"
                element={
                    <ProtectedRoute role="Vendor">
                        <VendorProducts />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vendor/inventory"
                element={
                    <ProtectedRoute role="Vendor">
                        <VendorInventory />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vendor/sales"
                element={
                    <ProtectedRoute role="Vendor">
                        <VendorSales />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vendor/profile"
                element={
                    <ProtectedRoute role="Vendor">
                        <VendorProfile />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default VendorRoutes;
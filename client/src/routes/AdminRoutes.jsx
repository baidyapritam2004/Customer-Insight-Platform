import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import UploadPage from "../pages/UploadPage";
import Vendors from "../pages/Vendors";
import Products from "../pages/Products";
import Analytics from "../pages/Analytics";
import Inventory from "../pages/Inventory";
import Orders from "../pages/Orders";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <ProtectedRoute role="Administrator">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="customers"
        element={
          <ProtectedRoute role="Administrator">
            <Customers />
          </ProtectedRoute>
        }
      />

      <Route
        path="upload"
        element={
          <ProtectedRoute role="Administrator">
            <UploadPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="vendors"
        element={
          <ProtectedRoute role="Administrator">
            <Vendors />
          </ProtectedRoute>
        }
      />

      <Route
        path="products"
        element={
          <ProtectedRoute role="Administrator">
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="analytics"
        element={
          <ProtectedRoute role="Administrator">
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="inventory"
        element={
          <ProtectedRoute role="Administrator">
            <Inventory />
          </ProtectedRoute>
        }
      />

      <Route
        path="orders"
        element={
          <ProtectedRoute role="Administrator">
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="reports"
        element={
          <ProtectedRoute role="Administrator">
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="settings"
        element={
          <ProtectedRoute role="Administrator">
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AdminRoutes;
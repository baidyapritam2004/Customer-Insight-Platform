import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminRoutes from "./routes/AdminRoutes";
import VendorRoutes from "./routes/VendorRoutes";

function App() {
    return (
        <>
            {/* Public Routes */}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>

            {/* Administrator Routes */}
            <AdminRoutes />

            {/* Vendor Routes */}
            <VendorRoutes />
        </>
    );
}

export default App;
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./components/auth/ProtectedRoute";


function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}

export default App;

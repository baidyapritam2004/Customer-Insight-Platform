import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";

import "../../styles/auth.css";
const API_URL = import.meta.env.VITE_API_URL;
function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/login`,
        form
      );

      console.log(res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const user = res.data.user;

      // Store user information
      localStorage.setItem("role", user.role);
      localStorage.setItem("email", user.email);
      localStorage.setItem("name", user.name);

      // Store vendor ID if the user is a vendor
      if (user.role === "Vendor") {
        localStorage.setItem("vendor_id", user.vendor_id);
      }

      // Navigate according to role
      if (user.role === "Administrator") {
        navigate("/admin/dashboard");
      } else if (user.role === "Vendor") {
        navigate("/vendor/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Welcome Back</h2>
        <p className="subtitle">
          Sign in to Customer Insight Platform
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <FaUser />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="auth-btn"
          >
            Login
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <Link
          to="/signup"
          className="auth-link"
        >
          Create new account
        </Link>

      </div>
    </div>
  );
}

export default LoginForm;
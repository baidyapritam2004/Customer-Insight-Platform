import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";

import "../../styles/auth.css";

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
      "http://127.0.0.1:5000/login",
      form
    );
    console.log(res.data);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    const user = res.data.user;

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
        <h1>Welcome Back</h1>

        <p className="subtitle">Sign in to Customer Insight Platform</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser />

            <input
              type="email"
              name="email"
              placeholder="Email"
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

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <Link to="/signup" className="auth-link">
          Create new account
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;

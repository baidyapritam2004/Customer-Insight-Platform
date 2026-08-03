import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "../../styles/auth.css";

function SignupForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  role: "Vendor",
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
      const res = await axios.post("http://127.0.0.1:5000/signup", form);

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <select
  name="role"
  value={form.role}
  onChange={handleChange}
>
  <option value="Vendor">Vendor</option>
  <option value="Administrator">Administrator</option>
</select>

          <button type="submit">Create Account</button>
        </form>

        <p>{message}</p>

        <Link to="/login">Already have an account?</Link>
      </div>
    </div>
  );
}

export default SignupForm;

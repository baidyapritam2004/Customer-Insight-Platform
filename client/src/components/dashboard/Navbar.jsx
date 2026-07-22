import { useState } from "react";
import {
  FaBell,
  FaSearch,
  FaMoon,
  FaSun,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

import "../../styles/navbar.css";

function Navbar({ info }) {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
console.log("Navbar Info:", info);
console.log("Notifications:", info?.notifications);
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div>
          <h2>Customer Insight Platform</h2>

          <small className="dataset-name">{info?.dataset_name}</small>
        </div>

        <div className="search-box">
          <FaSearch className="search-icon" />

          <input type="text" placeholder="Search customers..." />
        </div>
      </div>

      <div className="navbar-right">
        <span className="date">{today}</span>

        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="notification-container">
          <div
            className="notification"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />

            <span className="badge">{info?.notification_count || 0}</span>
          </div>

          {showNotifications && (
            <div className="notification-dropdown">

    <div className="notification-header">

        <h3>Notifications</h3>

    </div>

    {info?.notifications?.map((item, index) => (

        <div
            key={index}
            className="notification-item"
        >

            <h4>{item.title}</h4>

            <small>{item.time}</small>

        </div>

    ))}

</div>
          )}
        </div>

        <div className="profile">
          <FaUserCircle className="avatar" />

          <div className="profile-info">
            <h4>{info?.user_name || "Admin"}</h4>

            <small>{info?.role || "Administrator"}</small>
          </div>

          <FaChevronDown className="dropdown-icon" />
        </div>
      </div>
    </header>
  );
}

export default Navbar;

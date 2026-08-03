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

function VendorNavbar({ info }) {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="navbar">
      {/* Left */}

      <div className="navbar-left">
        <div>
          <h2>InsightSync AI</h2>

          <small className="dataset-name">
            {info?.business_name || "Vendor Portal"}
          </small>
        </div>

        <div className="search-box">
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search products..."
          />
        </div>
      </div>

      {/* Right */}

      <div className="navbar-right">
        <span className="date">{today}</span>

        {/* Dark Mode */}

        <button
          className="icon-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Notifications */}

        <div className="notification-container">
          <div
            className="notification"
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
          >
            <FaBell />

            <span className="badge">
              {info?.notification_count || 0}
            </span>
          </div>

          {showNotifications && (
            <div className="notification-dropdown">

              <div className="notification-header">
                <h3>Notifications</h3>
              </div>

              {info?.notifications?.length ? (
                info.notifications.map((item, index) => (
                  <div
                    key={index}
                    className="notification-item"
                  >
                    <h4>{item.title}</h4>

                    <small>{item.time}</small>
                  </div>
                ))
              ) : (
                <div className="notification-item">
                  <small>No notifications</small>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Profile */}

        <div className="profile">
          <FaUserCircle className="avatar" />

          <div className="profile-info">
            <h4>{info?.owner_name || "Vendor"}</h4>

            <small>{info?.role || "Vendor"}</small>
          </div>

          <FaChevronDown className="dropdown-icon" />
        </div>
      </div>
    </header>
  );
}

export default VendorNavbar;
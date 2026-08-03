import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaBars,
  FaChartLine,
  FaBoxes,
  FaWarehouse,
  FaRupeeSign,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import "../../styles/sidebar.css";

function VendorSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="sidebar-header">
        {!collapsed && <h2>Vendor Panel</h2>}

        <button
          className="menu-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </button>
      </div>

      <nav>

        <NavLink
          to="/vendor/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaChartLine />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/vendor/inventory"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaWarehouse />
          {!collapsed && <span>Inventory</span>}
        </NavLink>

        <NavLink
          to="/vendor/products"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaBoxes />
          {!collapsed && <span>Products</span>}
        </NavLink>

        <NavLink
          to="/vendor/sales"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaRupeeSign />
          {!collapsed && <span>Sales</span>}
        </NavLink>

        <NavLink
          to="/vendor/profile"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaUserCircle />
          {!collapsed && <span>Profile</span>}
        </NavLink>

      </nav>

      <div className="logout">
        <button onClick={handleLogout}>
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default VendorSidebar;
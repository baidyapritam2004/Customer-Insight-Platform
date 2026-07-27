import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaBars,
  FaChartLine,
  FaUsers,
  FaChartPie,
  FaFileAlt,
  FaUpload,
  FaCog,
  FaSignOutAlt,
  FaStore,
  FaShoppingCart,
  FaBoxes
} from "react-icons/fa";
import "../../styles/sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };
  return (
    <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="sidebar-header">
        {!collapsed && <h2>Insights AI</h2>}

        <button className="menu-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
      </div>

      <nav>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaChartLine />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaUsers />
          {!collapsed && <span>Customers</span>}
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaChartPie />
          {!collapsed && <span>Analytics</span>}
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaFileAlt />
          {!collapsed && <span>Reports</span>}
        </NavLink>

        <NavLink
          to="/upload"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaUpload />
          {!collapsed && <span>Upload CSV</span>}
        </NavLink>

        <NavLink to="/analytics"></NavLink>

        <NavLink
          to="/vendors"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaStore />
          {!collapsed && <span>Vendors</span>}
        </NavLink>

        <NavLink
    to="/inventory"
    className={({ isActive }) =>
        isActive ? "menu-item active" : "menu-item"
    }
>
    <FaBoxes />
    {!collapsed && <span>Inventory</span>}
</NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaShoppingCart />
          {!collapsed && <span>Orders</span>}
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaCog />
          {!collapsed && <span>Settings</span>}
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

export default Sidebar;

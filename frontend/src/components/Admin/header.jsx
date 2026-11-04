import "./header.css";
import logo from "../../assets/Logo.png";
import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  FaHome, FaUsers, FaBuilding, FaUserTie, FaBriefcase, FaFileAlt, FaChartBar,
  FaBell, FaChevronDown, FaUser, FaCog, FaSignOutAlt
} from "react-icons/fa";

function Header() {
  const notificationCount = 3;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setDropdownOpen(false);
    localStorage.clear();
    navigate("/login");
  }

  const adminName = localStorage.getItem("adminName") || "Mukesh Kumar";

  return (
    <header className="admin-header">

      {/* Brand */}
      <div className="brand">
        <Link to="/" className="brand-link" aria-label="Go to home page">
          <img src={logo} className="logo" alt="ABC Career Connect" />
        </Link>
        <div className="brand-copy">
          <h1>ABC <span>Career Connect</span></h1>
          <p>Connecting Talent. Creating Futures</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="nav">
        <NavLink
          to="/admin"
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          end
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/students"
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <FaUsers />
          <span>Students</span>
        </NavLink>

        <NavLink
          to="/admin/companies"
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <FaBuilding />
          <span>Companies</span>
        </NavLink>

        <NavLink
          to="/admin/recruiters"
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <FaUserTie />
          <span>Recruiters</span>
        </NavLink>

        <NavLink
          to="/admin/drives"
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <FaBriefcase />
          <span>Drives</span>
        </NavLink>

        <NavLink
          to="/admin/applications"
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <FaFileAlt />
          <span>Applications</span>
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          <FaChartBar />
          <span>Reports</span>
        </NavLink>
      </nav>

      {/* Right side: bell + admin */}
      <div className="header-right">

        {/* Notification bell */}
        <Link to="/admin/notifications" style={{ textDecoration: "none" }}>
          <div className="bell-wrapper" aria-label={`${notificationCount} notifications`}>
            <FaBell className="bell-icon" />
            {notificationCount > 0 && (
              <span className="bell-badge">{notificationCount}</span>
            )}
          </div>
        </Link>

        {/* Admin profile + dropdown */}
        <div className="admin-wrapper" ref={dropdownRef} style={{ position: "relative" }}>
          <button
            className="admin-profile"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="admin-avatar">
              <FaUser />
            </div>
            <div className="admin-info">
              <span className="admin-name">{adminName}</span>
              <span className="admin-role">Placement Admin</span>
            </div>
            <FaChevronDown className={`admin-chevron ${dropdownOpen ? "open" : ""}`} />
          </button>

          {dropdownOpen && (
            <div
              className="admin-dropdown"
              role="menu"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                minWidth: "200px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.10)",
                padding: "6px",
                zIndex: 9999,
                display: "block"
              }}
            >
              <NavLink
                to="/admin/profile"
                className="dropdown-item"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <FaUser className="dropdown-icon" />
                <span>Profile</span>
              </NavLink>

              <NavLink
                to="/admin/reports"
                className="dropdown-item"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <FaChartBar className="dropdown-icon" />
                <span>Analytics</span>
              </NavLink>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item logout"
                role="menuitem"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="dropdown-icon" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;

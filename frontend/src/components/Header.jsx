import "./Header.css";
import logo from "../assets/Logo.png";
import { Link, NavLink } from "react-router-dom";
import { FaHome, FaSignInAlt, FaGraduationCap, FaBuilding } from "react-icons/fa";

function Header() {
  return (
    <header className="main-public-header">
      <div className="header-inner">
        <div className="brand">
          <Link to="/" className="brand-link" aria-label="Go to home page">
            <div className="logo-wrapper">
              <img src={logo} className="logo" alt="ABC Career Connect" />
            </div>
          </Link>

          <div className="brand-copy">
            <h1>ABC <span>Career Connect</span></h1>
            <p>Connecting Talent • Creating Futures</p>
          </div>
        </div>

        <nav className="nav">
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            end
          >
            <FaHome />
            <span>Home</span>
          </NavLink>

          <Link to="/login" className="portal-login-btn">
            <FaSignInAlt />
            <span>Sign In to Portal</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

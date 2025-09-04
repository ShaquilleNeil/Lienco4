import React from 'react';
import './Navbar.css';
import { Link as RouterLink } from 'react-router-dom';
import logo from './Images/lienco3.png';
import Emergency from './Emergency/Emergency';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout();
    }
  };

  return (
    <div className="nav">
      {/* Logo */}
      <div className="nav-logo">
        <img src={logo} alt="Lienco Logo" />
      </div>

      {/* Hamburger Menu Button */}
      <input className="menu-btn" type="checkbox" id="menu-btn" />
      <label htmlFor="menu-btn" className="menu-icon" aria-label="Toggle Menu">
        <span className="navicon"></span>
      </label>

      {/* Navbar Links */}
      <ul className="nav-menu">
        <li>
          <RouterLink to="/" className="nav-link">
            HOME
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/about" className="nav-link">
            ABOUT US
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/assessment" className="nav-link">
            ASSESSMENT
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/contact" className="nav-link">
            CONTACT US
          </RouterLink>
        </li>
        {isLoggedIn && (
          <>
            <li>
              <RouterLink to="/dashboard" className="dashboard-button nav-link">
                DASHBOARD
              </RouterLink>
            </li>
            <li>
              <button className="logout-button" onClick={handleLogout}>
                <b>Log out</b>
              </button>
            </li>
          </>
        )}
        <li className="emergency">
          <Emergency />
        </li>
      </ul>
    </div>
  );
};

export default Navbar;

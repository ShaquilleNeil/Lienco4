import React from 'react'
import './Navbar.css';
import { Link } from 'react-scroll'
import logo from './Images/lienco3.png';
import Emergency from './Emergency/Emergency';
import { Link as RouterLink } from 'react-router-dom'


const Navbar = ({ isLoggedIn, onLogout}) => {
  

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      onLogout();
    }
  };

  return (
    <div className='nav'>
    <div className='nav-logo'>
      <img src={logo} alt='logo' />
    </div>

    <ul className='nav-menu'>
      <li>
        <RouterLink to="/">HOME</RouterLink>
      </li>
      <li>
        <RouterLink to="/about">ABOUT US</RouterLink>
      </li>
      <li>
        <RouterLink to="/assessment">ASSESSMENT</RouterLink>
      </li>
      <li>
        <RouterLink to="/contact">CONTACT US</RouterLink>
      </li>
      {isLoggedIn && (
        <li>
          <RouterLink to="/dashboard" className='dashboard-button'>DASHBOARD</RouterLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <button className='logout-button' onClick={handleLogout}><b>Log out</b></button>
        </li>
      )}
      <li className='emergency'><Emergency /></li>
    </ul>
  </div>
  )
}

export default Navbar

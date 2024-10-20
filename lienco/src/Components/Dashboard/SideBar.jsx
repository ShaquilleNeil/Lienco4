import React from 'react';
import './SideBar.css';
import { Link as RouterLink } from 'react-router-dom';
import logo1 from '../Images/lienco3.png';

const SideBar = () => {
  return (
    <div className='sidenav'>
      <div className='sidenav-logo'>
        <img src={logo1} alt='logo' />
      </div>

      <ul className='sidenav-menu'>
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/about">About Us</RouterLink>
        </li>
        <li>
          <RouterLink to="/assessment">Assessment</RouterLink>
        </li>
        <li>
          <RouterLink to="/contact">Contact Us</RouterLink>
        </li>
        <li>
          <RouterLink to="/pdash">Projects</RouterLink> {/* Capitalized "Projects" */}
        </li>

        <li>
          <RouterLink to="/ticket">Edit</RouterLink> {/* Capitalized "Projects" */}
        </li>
      </ul>
    </div>
  );
}

export default SideBar;

import React from 'react';
import './SideBar.css';
import { Link as RouterLink } from 'react-router-dom';
import logo1 from '../Images/lienco3.png';

const SideBar = ({ userRole }) => { // Accept userRole as a prop
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
          <RouterLink to="/pdash">Projects</RouterLink>
        </li>

        {/* Conditionally render the "Edit" option for project managers */}
        {userRole === 'project manager' && ( // Use && to conditionally render
          <li>
            <RouterLink to="/ticket">Edit</RouterLink>
          </li>
        )}
      </ul>
    </div>
  );
}

export default SideBar;

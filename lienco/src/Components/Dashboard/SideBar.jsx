import React from 'react';
import './SideBar.css';
import { Link as RouterLink } from 'react-router-dom';
import NotificationBell from './notificationbell'; // Import your NotificationBell component
import logo1 from '../Images/lienco3.png';

const SideBar = ({ userRole }) => {
  // Set the dashboard route based on user role
  const dashboardRoute = userRole === 'project manager' ? '/dashboard' : '/dashboard';

  return (
    <div className='sidenav'>
      <div className='sidenav-logo'>
        <img src={logo1} alt='logo' />
      </div>

      {/* Add Notification Bell */}
      <div className='notification-bell-container'>
        <NotificationBell />
      </div>

      <ul className='sidenav-menu'>
        {/* Link to the main website */}
        <li>
          <a href='/' className='lienco-link'>Lienco</a>
        </li>
        
        {/* Dynamic Home link based on user role */}
        <li>
          <RouterLink to={dashboardRoute}>Dashboard</RouterLink>
        </li>
        
        <li>
          <RouterLink to="/pdash">Projects</RouterLink>
        </li>

        <li>
          <RouterLink to="/resource-dashboard">Resources</RouterLink>
        </li>

        {/* Conditionally render "Add Project" for project managers */}
        {userRole === 'project manager' && (
          <li>
            <RouterLink to="/ticket">Add Project</RouterLink>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SideBar;

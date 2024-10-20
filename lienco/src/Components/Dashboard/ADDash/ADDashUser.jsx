import React from 'react';
import './ADDashUser.css';
import Header from '../Header.jsx';
import Sidebar from '../SideBar.jsx';
import ManageUserRoles from './ManageUserRoles'; // Import your role management component

const DashUser = () => {
  return (
    <div className='addash'>
      <Header />
      <Sidebar />
      
      <div className='cards'>
        {/* Other cards or components can go here */}

        {/* Render the ManageUserRoles component for admin access */}
        <ManageUserRoles />
      </div>
    </div>
  );
}

export default DashUser;

import React, { useState, useEffect, useRef } from 'react';

import './ADDashUser.css';
import Header from '../Header.jsx';
import Sidebar from '../SideBar.jsx';
import ManageUserRoles from './ManageUserRoles'; // Import your role management component

const DashUser = () => {

  const [isAssessVisible, setIsAssessVisible] = useState(false);
  const aRef = useRef(null);

  const toggleAform = () => {
    setIsAssessVisible(!isAssessVisible);
  };

  const handleClickOutside = (event) => {
    if (aRef.current && !aRef.current.contains(event.target)) {
      setIsAssessVisible(false);
    }
  };

  // Add event listener for detecting clicks outside of the form
  useEffect(() => {
    if (isAssessVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAssessVisible]);

  return (
    <div className='addash'>
      <Header />
      <Sidebar />
      
      {/* <div className='cards'>
      
        <ManageUserRoles />
      </div> */}
      <div className='addashuser'>
        <div className='containeradd'>
          <div className='container1add' onClick={toggleAform}>
            <h2>Manage Users</h2>
            <h2 className='click'>Click Here</h2>
          </div>
          <div className='container2add'>
            <h2>ESTIMATE CALCULATOR</h2>
            <h2 className='click'>COMING SOON</h2>
          </div> 

          {isAssessVisible && ( // Conditional rendering
           <div className="overlay">
           <div className="form-container" ref={aRef}>
             <ManageUserRoles onClose={toggleAform} />
           </div>
         </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashUser;

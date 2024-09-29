import React, { useState, useEffect, useRef } from 'react';
import './Assessment.css';
import Aform from './Form'; // Assuming this is your form component

const Assessment = () => {
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

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  return (
    <div className='assessment'>
      <div className='container'>
        <div className='container1' onClick={toggleAform}>
          <h2>ON-SITE ASSESSMENT FORM</h2>
          <h2 className='click'>Click Here</h2>
        </div>
         <div className='container2'>
          <h2>ESTIMATE CALCULATOR</h2>
          <h2 className='click'>Click Here</h2>
        </div> 



        {isAssessVisible && ( // Conditional rendering
          <div ref={aRef}>
            <Aform onClose={toggleAform} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;

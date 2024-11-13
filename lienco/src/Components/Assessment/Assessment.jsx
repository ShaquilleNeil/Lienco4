import React, { useState } from 'react';
import './Assessment.css';
import Aform from './Form'; // Assuming this is your form component
import AssessmentCalculator from '../Calculator/calculator'; 

const Assessment = () => {
  const [isAssessVisible, setIsAssessVisible] = useState(false);
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false); // State for Calculator visibility

  const toggleAform = () => {
    setIsAssessVisible(!isAssessVisible);
  };

  const toggleCalculator = () => {
    setIsCalculatorVisible(!isCalculatorVisible); // Toggle calculator visibility
  };

  return (
    <div className="assessment">
      <div className="container">
        <div className="container1" onClick={toggleAform}>
          <h2>ON-SITE ASSESSMENT FORM</h2>
          <h2 className="click">Click Here</h2>
        </div>

        <div className="container2" onClick={toggleCalculator}>
          <h2>ESTIMATE CALCULATOR</h2>
          <h2 className="click">COMING SOON</h2>
        </div>

        {isAssessVisible && <Aform onClose={toggleAform} />} {/* Show assessment form */}
        {isCalculatorVisible && <AssessmentCalculator isCalculatorVisible={isCalculatorVisible} onClose={toggleCalculator} />} {/* Show calculator */}
      </div>
    </div>
  );
};

export default Assessment;

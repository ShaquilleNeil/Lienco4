import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressRing = ({ percentage, title, titleSize = '16px', spentAmount, totalAmount }) => {
  return (
    <div style={{ width: '100px', height: '150px', margin: '0 auto', textAlign: 'center' }}>
      <h4 style={{ fontSize: titleSize }}>{title}</h4>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          textSize: '16px',
          pathColor: '#4db8ff', 
          textColor: '#4db8ff', 
          trailColor: '#d6d6d6',
        })}
      />
      <div style={{ marginTop: '10px' }}>
        <span style={{ fontSize: '16px', color: '#4db8ff' }}>
          ${spentAmount} / ${totalAmount}
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;

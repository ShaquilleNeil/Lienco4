// src/Reset.jsx
import React, { useState } from 'react';
import { resetPassword } from '../Auth';
import './Reset.css'; // Ensure you import your resetPassword function
import { useNavigate } from 'react-router-dom'; 

const Reset = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    

    try {
      await resetPassword(email);
      setSuccessMessage('Password reset email sent successfully!'); // Notify the user
      setEmail(''); // Clear the email input
      
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    navigate('/'); // Redirect to homepage when closing the form
  };

  return (
    <div>
       <div className='reset-container'>
      
      <form onSubmit={handleReset}>
      {/* <span className="icon-close" onClick={handleClose}>X</span> */}
      <h2>Reset Password</h2>
        <label htmlFor="reset-email">Enter your email:</label>
        <input
          type="email"
          id="reset-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit">Send Reset Email</button>
      </form>
      </div>
    </div>
  );
};

export default Reset;

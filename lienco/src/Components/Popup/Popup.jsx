// src/Popup.js
import React, { useState } from 'react';
import { login } from '../Auth'; // Make sure to import your login function
import './Popup.css';

const Popup = ({ isVisible, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isVisible) return null; // Don't render if not visible

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    try {
      await login(email, password); // Call your login function
      onLogin();
      onClose(); // Close the popup on successful login
    } catch (err) {
      setError(err.message); // Set error message
    }
  };

  return (
    <div className='popup-overlay' onClick={onClose}>
      <div className='popup-container' onClick={(e) => e.stopPropagation()}>
        <div className='popup-content'>
          <span className="icon-close" onClick={onClose}>
            X
          </span>
          
          <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <span className="icon-close" onClick={onClose}>X</span>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='example@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='********'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="error-message">{error}</p>}
            <div className='btn'>
              <button type="submit" className='popup-button1'>Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Popup;

// src/Signpop.js
import React, { useState } from 'react';
import { register } from '../Auth'; // Import your register function
import './signpop.css';

const Signpop = ({ isSignVisible, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isSignVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await register(email, password); // Call your register function
      onClose(); // Close the popup on successful registration
    } catch (err) {
      setError(err.message); // Set error message
    }
  };

  return (
    <div className='signpop-overlay' onClick={onClose}>
      <div className='signpop-container' onClick={(e) => e.stopPropagation()}>
        <div className='signpop-content'>
          <span className="icon-close" onClick={onClose}>X</span>
      
          <form onSubmit={handleSubmit}>
          <h1>Sign up</h1>
          <span className="icon-close" onClick={onClose}>X</span>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder='example'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
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
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder='********'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="error-message">{error}</p>}
            <div className='btn'>
              <button type="submit" className='signpop-button1'>Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signpop;

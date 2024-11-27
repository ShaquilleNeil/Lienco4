import React, { useState } from 'react';
import { login } from '../Auth'; // Make sure to import your login function
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Popup.css';

const Popup = ({ isVisible, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isVisible) return null; // Don't render if not visible

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state

    try {
      const {user, role} =await login(email, password); // Call your login function
      onLogin(role);
      onClose(); // Close the popup on successful login
    } catch (err) {
      setError(err.message); // Set error message
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
    <div className='popup-overlay' onClick={onClose}>
      <div className='popup-container' onClick={(e) => e.stopPropagation()}>
        <div className='popup-content'>
          <span className="icon-close" onClick={onClose}>
            X
          </span>
          
          <form onSubmit={handleSubmit}>
          <span className="icon-close" onClick={onClose}>X</span>
            <h1>Login</h1>
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
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
  <input
    className="password-input" // Use a consistent class for styling
    type={showPassword ? 'text' : 'password'}
    id="password"
    name="password"
    placeholder="********"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <button
    type="button"
    onClick={togglePasswordVisibility}
    style={{
      position: 'absolute',
      right: '10px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0',
      fontSize: '16px',
    }}
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    {showPassword ? '👁️' : '👁️‍🗨️'}
  </button>
</div>

            {error && <p className="error-message">{error}</p>}
            <div className='btn'>
              <button type="submit" className='popup-button1'>Login</button>
            </div>
            <div className="reset-password">
              <Link to="/reset">Forgot your password?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Popup;

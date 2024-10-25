import React, { useState, useEffect } from 'react';
import './Header.css';
import { auth } from '../firebase'; // Make sure your Firebase auth is set up correctly
import { onAuthStateChanged } from 'firebase/auth';

const Header = () => {
  const [userEmail, setUserEmail] = useState(null);
  

  // Listen for changes in the authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Set the logged-in user's email
      } else {
        setUserEmail(null); // User is logged out, reset the email state
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  return (
    <div className="header">
      <input type="text" name="search" id="search" placeholder="Search" />
      {userEmail ? (
        <span>{userEmail}</span>
      ) : (
        <span>No user logged in</span>
      )}
    </div>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import './Header.css';
import { auth } from '../firebase'; // Make sure your Firebase auth is set up correctly
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut

const Header = ({ onLogout }) => {
  const [userEmail, setUserEmail] = useState(null);
  
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await signOut(auth); // Sign out from Firebase
        onLogout(); // Call the onLogout function passed from the parent
        alert("You have successfully logged out."); // Optional feedback
      } catch (error) {
        console.error("Error signing out: ", error);
        alert("Failed to log out. Please try again."); // Optional error feedback
      }
    }
  };

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
      <input className="search-input" type="text" name="search" id="search" placeholder="Search" />
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {userEmail ? (
        <span>{userEmail}</span>
      ) : (
        <span>No user logged in</span>
      )}
    </div>
  );
};

export default Header;

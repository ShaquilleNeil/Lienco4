import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import About from './Components/About/About';
import Assessment from './Components/Assessment/Assessment';         
import Contact from './Components/Contact/Contact';
import Dashboard from './Components/Dashboard/DashUser';
import Reset from './Components/Popup/Reset';
import PMDashboard from './Components/Dashboard/PMDashboard/PMDashUser';
import AdminDashboard from './Components/Dashboard/ADDash/ADDashUser';
import Projects from './Components/Pdash/Dashboard';
import Tickets from './Components/Pdash/TicketPage';
import { auth } from './Components/firebase'; // Import your firebase configuration
import { onAuthStateChanged } from 'firebase/auth'; // Import for auth state
import { doc, getDoc } from 'firebase/firestore';
import { db } from './Components/firebase'; // Adjust as per your setup

const fetchUserRole = async (uid) => {
  const docRef = doc(db, 'Roles', uid); // Assuming 'Roles' is your Firestore collection
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data().role; // Adjust if your role is stored differently
  } else {
    return 'user'; // Default role if none found
  }
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate(); // Create a navigate function

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await fetchUserRole(user.uid); // Fetch role on successful login
        setUserRole(role);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
      setLoading(false); // Set loading to false after fetching user role
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    // Log out from Firebase
    auth.signOut().then(() => {
      setIsLoggedIn(false);
      setUserRole(null);
      navigate('/'); // Redirect to the home page
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  };

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  if (loading) {
    return <div>Loading...</div>; // Optional loading indicator
  }

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Hero isLoggedIn={isLoggedIn} onLogin={handleLogin} />} />
        <Route path="/about" element={<About />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/pdash" element={<Projects userRole={userRole} />} />
        <Route path="/ticket" element={<Tickets />} />
        <Route path="/ticket/:id" element={<Tickets editMode={true} />} />
        <Route 
          path="/dashboard" 
          element={
            userRole === 'admin' ? (
              <AdminDashboard onLogout={handleLogout}  />
            ) : userRole === 'project manager' ? (
              <PMDashboard onLogout={handleLogout} userRole={userRole} />
            ) : (
              <Dashboard onLogout={handleLogout} />
            )
          } 
        />
      </Routes>
    </div>
  );
}

export default App;

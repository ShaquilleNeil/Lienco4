import React, { useState} from 'react';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import About from './Components/About/About';
import Assessment from './Components/Assessment/Assessment';         
import Contact from './Components/Contact/Contact';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './Components/Dashboard/DashUser';
import Reset from './Components/Popup/Reset';
import PMDashboard from './Components/Dashboard/PMDashboard/PMDashUser';
import AdminDashboard from './Components/Dashboard/ADDash/ADDashUser';
import Projects from './Components/Pdash/Dashboard';
import Tickets from './Components/Pdash/TicketPage';




function App() {


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  return (
    <Router>
      <div>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Hero isLoggedIn={isLoggedIn} onLogin={handleLogin} />} />
          <Route path="/about" element={<About />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/pdash" element={<Projects />} />
          <Route path="/ticket" element={<Tickets />} />
          <Route path="/ticket/:id" element={<Tickets editMode={true} />} />
          <Route 
            path="/dashboard" 
            element={
              userRole === 'admin' ? (
                <AdminDashboard />
              ) :
              userRole === 'project manager' ? (
                <PMDashboard />
              ) : (
                <Dashboard />
              )
            } 
          /> {/* Render different dashboards based on user role */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

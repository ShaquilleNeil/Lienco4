import React, { useState} from 'react';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import About from './Components/About/About';
import Assessment from './Components/Assessment/Assessment';         
import Contact from './Components/Contact/Contact';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './Components/Dashboard/DashUser';
import Reset from './Components/Popup/Reset';



function App() {


  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
    <div>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Hero isLoggedIn={isLoggedIn} onLogin={handleLogin} />
          </>
        } />
        <Route path="/about" element={
          <>
            <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <About />
          </>
        } />
        <Route path="/assessment" element={
          <>
            <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Assessment />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Contact />
          </>
        } />
        <Route path="/dashboard" element={<Dashboard />} /> {/* No Navbar here */}
        <Route path="/reset" element={<Reset />} /> {/* Reset password route */}
      </Routes>

    </div>
  </Router>
  );
}

export default App;

import React, { useState } from 'react'
import './Emergency.css'
const Emergency = () => {

    const [location, setLocation] = useState(null);

    const handleEmergencyClick = () => {
        // Get the user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                triggerCall(latitude, longitude);
            }, () => {
                alert('Unable to retrieve your location.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const triggerCall = (latitude, longitude) => {
        // Calculate the appropriate phone number based on proximity
        const phoneNumber = getEmergencyNumber(latitude, longitude);
        
        // Use window.location to initiate a phone call
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        } else {
            alert('No emergency number available for this location.');
        }
    };

    const getEmergencyNumber = (latitude, longitude) => {
        // Add logic to determine phone number based on proximity
        // This could be a lookup in a database or a simple conditional
        const emergencyNumber = '15146633754'
        // For example:
        if (latitude && longitude) {
            // Example condition based on arbitrary proximity logic
            if (latitude > 40.0) {
                return emergencyNumber; // Example for a specific area
            }
            // Add more conditions as needed
        }
        return null; // Default case
    };







  return (
   
        
    <button className="emergency" onClick={handleEmergencyClick}>
           <b> Emergency</b>
        </button>
   
  )
}

export default Emergency

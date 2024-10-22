import React, { useState } from 'react';
import './Emergency.css';

const emergencyNumbers = [
    { name: "Emergency Services", number: "15146633754", latitude: 40.730610, longitude: -73.935242 }, // Example coordinates
    { name: "Fire Department", number: "15146633755", latitude: 40.730620, longitude: -73.935252 },
    { name: "Chadi", number: "15146633754", latitude: 40.730630, longitude: -73.935262 },
    // Add more numbers as needed
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

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
        let closestNumber = null;
        let closestDistance = Infinity;

        // Calculate the closest emergency number
        emergencyNumbers.forEach(emergency => {
            const distance = calculateDistance(latitude, longitude, emergency.latitude, emergency.longitude);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestNumber = emergency.number;
            }
        });

        // Initiate the phone call
        if (closestNumber) {
            window.location.href = `tel:${closestNumber}`;
        } else {
            alert('No emergency number available for this location.');
        }
    };

    return (
        <button className="emergency" onClick={handleEmergencyClick}>
            <b> Emergency</b>
        </button>
    );
};

export default Emergency;

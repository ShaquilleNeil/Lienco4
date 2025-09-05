import React, { useState, useEffect, useRef } from 'react';
import './ADDashUser.css';
import Header from '../Header.jsx';
import Sidebar from '../SideBar.jsx';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import ManageUserRoles from './ManageUserRoles';
import MeetingScheduler from '../PMDashboard/meetingscheduler.jsx';
// Optional: include Carousel if needed
// import Carousel from './swiper.jsx';

const ADDashUser = ({ onLogout, userRole, events }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [meetings, setMeetings] = useState([]);
  const [weather, setWeather] = useState(null);
  
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [isAssessVisible, setIsAssessVisible] = useState(false);
  const aRef = useRef(null);

  const toggleAform = () => setIsAssessVisible(!isAssessVisible);

  const handleClickOutside = (event) => {
    if (aRef.current && !aRef.current.contains(event.target)) {
      setIsAssessVisible(false);
    }
  };

  const fetchWeather = async () => {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const city = 'Montreal';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setWeather({
        temperature: data.main.temp,
        condition: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchMeetings = (setter) => {
    const db = getFirestore();
    const meetingsRef = collection(db, 'meetings');
    getDocs(meetingsRef)
      .then((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            start: new Date(data.start.seconds * 1000),
          };
        });
        setter(items);
      })
      .catch((error) => console.error('Error fetching meetings:', error));
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAssessVisible]);

  useEffect(() => {
    fetchMeetings(setMeetings);
    fetchWeather();

    if (user?.email) {
      const encodeEmail = (email) => email.replace(/\./g, '_dot_').replace(/@/g, '_at_');
      const encodedUserId = encodeEmail(user.email);
      const notificationsRef = ref(getDatabase(), `notifications/${encodedUserId}`);

      const unsubscribe = onValue(
        notificationsRef,
        (snapshot) => {
          const data = snapshot.val();
          const arr = data
            ? Object.entries(data).map(([key, val]) => ({ id: key, ...val }))
            : [];
          setNotifications(arr);
          setUnreadCount(arr.filter((n) => !n.read).length);
        },
        (err) => console.error('Error fetching notifications:', err)
      );

      return () => unsubscribe();
    }
  }, [user]);

  const today = new Date();
  const todayMeetings = meetings.filter(
    (m) => m.start.toDateString() === today.toDateString()
  );

  const handleNotificationClick = (ticketId) => {
    navigate('/pdash');
  };

  return (
    <div className="addashuser">
      <Header onLogout={onLogout} />
      <Sidebar userRole={userRole} />

      <div className="addashcontent">
        <div className="adtopbox">
          <div className="adtopbox1">
            {weather ? (
              <div className="weather-container">
                <h4>Weather Update</h4>
                <img src={weather.icon} alt="Weather Icon" />
                <p>{weather.temperature}°C</p>
                <p>{weather.condition}</p>
              </div>
            ) : (
              <p>Loading weather...</p>
            )}
          </div>

          <div className="adtopbox2">
            <h4>Scheduled Meetings</h4>
            <p className="adcounting">{todayMeetings.length} meetings today</p>
          </div>

          <div className="adtopbox4" onClick={toggleAform} style={{ cursor: 'pointer' }}>
            <h4>Manage User Roles</h4>
          </div>
        </div>

        <div className="adleftside">
          <div className="addashtainer1">
            <h4>Notifications</h4>
            <ul>
              {notifications.length ? (
                notifications.map((notification) => (
                  <li
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.ticketId)}
                    style={{
                      cursor: 'pointer',
                      padding: '10px',
                      backgroundColor: 'black',
                      color: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <p>{notification.message}</p>
                    <small>{new Date(notification.timestamp).toLocaleString()}</small>
                  </li>
                ))
              ) : (
                <p>No new notifications</p>
              )}
            </ul>
          </div>

          <div className="addashtainer2">
            <div className="budgettracker">
              <MeetingScheduler />
            </div>
          </div>
        </div>

        {isAssessVisible && (
          <div className="overlay">
            <div className="form-container" ref={aRef}>
              <ManageUserRoles onClose={toggleAform} />
            </div>
          </div>
        )}

        {/* Optional: Insert Carousel here if using */}
        {/* <Carousel /> */}
      </div>
    </div>
  );
};

export default ADDashUser;

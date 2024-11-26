import React, { useState, useEffect } from 'react';
import './DashUser.css';
import Header from './Header.jsx';
import Sidebar from './SideBar.jsx';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Chart from './PMDashboard/chart.jsx';
import Rchart from './PMDashboard/rchart.jsx';
import MeetingScheduler from './PMDashboard/meetingscheduler.jsx';
import ChatBubble from './ChatBubble.jsx';

const DashUser = ({ onLogout, userRole, spentAmount, totalAmount, resourceData, events }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [weather, setWeather] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const totalBudget = 50000;
  const usedBudget = 25000;
  const percentageUsed = (usedBudget / totalBudget) * 100;
  const percentageSpent = (spentAmount / totalAmount) * 100;

  const today = new Date();
  const todayMeetings = meetings.filter((meeting) => {
    const meetingDate = meeting.start;
    return meetingDate.toDateString() === today.toDateString();
  });

  const db = getFirestore();

  const fetchMeetings = async () => {
    try {
      const meetingsRef = collection(db, 'meetings');
      const querySnapshot = await getDocs(meetingsRef);
      const meetingsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        start: new Date(doc.data().start.seconds * 1000),
      }));
      setMeetings(meetingsData);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const fetchWeather = async () => {
    const apiKey = '0efcae3c3b8e82217ec228271583e1bf'; // Replace with your OpenWeatherMap API key
    const city = 'Montreal'; // Replace with your desired city
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      // Extract weather details
      setWeather({
        temperature: data.main.temp,
        condition: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  

  const handleNotificationClick = (ticketId) => {
    navigate(`/pdash`);
  };

  useEffect(() => {
    fetchMeetings();
    fetchWeather();

    if (user) {
      const userEmail = user.email;
      if (userEmail) {
        const encodeEmail = (email) => {
          return email.replace(/\./g, '_dot_').replace(/@/g, '_at_');
        };
        const encodedUserId = encodeEmail(userEmail);
        const db = getDatabase();
        const notificationsRef = ref(db, `notifications/${encodedUserId}`);

        const unsubscribe = onValue(
          notificationsRef,
          (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const notificationsArray = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
              }));
              setNotifications(notificationsArray);
              const unread = notificationsArray.filter((notification) => !notification.read).length;
              setUnreadCount(unread);
            } else {
              setNotifications([]);
              setUnreadCount(0);
            }
          },
          (error) => {
            console.error('Error fetching notifications:', error);
          }
        );

        return () => unsubscribe();
      }
    }
  }, [user]);

  return (
    <div className='dashuser'>
      <Header onLogout={onLogout} />
      <Sidebar userRole={userRole} />

      <div className='dashcontent'>
        <div className='topbox'>
          <div className='topbox1'>
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
          <div className='topbox2'>
            <h4>Scheduled Meetings</h4>
            <p className='counting'>{todayMeetings.length} meetings today</p>
          </div>
          <div className='topbox3'>
            <Rchart title="Resource Usage" percentage={percentageSpent.toFixed(2)} />
          </div>
          <div className='topbox4'>
            <Chart title="Budget Usage" percentage={percentageUsed.toFixed(2)} />
          </div>
        </div>
        <div className='leftside'>
          <div className='dashtainer1'>
            <h4>Notifications</h4>
            <ul>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.ticketId)}
                    style={{
                      cursor: 'pointer',
                      textDecoration: 'none',
                      padding: '10px',
                      backgroundColor: 'black',
                      color: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
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

          <div className='dashtainer2'>
            <div className='budgettracker'>
              <MeetingScheduler />
            </div>
          </div>
        </div>
      </div>
      <ChatBubble />
    </div>
  );
};

export default DashUser;

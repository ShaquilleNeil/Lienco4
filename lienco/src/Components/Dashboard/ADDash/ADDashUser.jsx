import React, { useState, useEffect, useRef  } from 'react';
import './ADDashUser.css';
import Header from '../Header.jsx';
import Sidebar from '../SideBar.jsx';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Import useNavigate to handle routing
import BudgetTracker from '../../Resources/budgettracker.jsx';
import MeetingScheduler from '../PMDashboard/meetingscheduler.jsx';
import Chart from '../PMDashboard/chart.jsx'
import Rchart from '../PMDashboard/rchart.jsx';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import ManageUserRoles from './ManageUserRoles'; // Import your role management component
import Carousel from './swiper.jsx'

const ADDashUser = ({ onLogout, userRole, events }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();  // Initialize useNavigate for navigation
  const [meetings, setMeetings] = useState([]);


  const today = new Date();
  const todayMeetings = meetings.filter((meeting) => {
    const meetingDate = meeting.start; // `start` is already converted to a Date
    return meetingDate.toDateString() === today.toDateString();
  });
  
  const [isAssessVisible, setIsAssessVisible] = useState(false);
  const aRef = useRef(null);

  const toggleAform = () => {
    setIsAssessVisible(!isAssessVisible);
  };

  const handleClickOutside = (event) => {
    if (aRef.current && !aRef.current.contains(event.target)) {
      setIsAssessVisible(false);
    }
  };

  useEffect(() => {
    if (isAssessVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAssessVisible]);

  const db = getFirestore();

  function fetchMeetings(setMeetings) {
    const meetingsRef = collection(db, "meetings");
    getDocs(meetingsRef)
      .then((querySnapshot) => {
        const meetings = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            start: new Date(data.start.seconds * 1000), // Convert Firestore Timestamp to Date
          };
        });
        setMeetings(meetings);
      })
      .catch((error) => {
        console.error("Error fetching meetings: ", error);
      });
  }
  


  // Handle notification click to navigate to the ticket
  const handleNotificationClick = (ticketId) => {
    navigate(`/pdash`);  // Navigate to the ticket page with ticketId in URL
  };

  useEffect(() => {

    fetchMeetings(setMeetings);

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
    <div className='addashuser'>
      <Header onLogout={onLogout} />
      <Sidebar userRole={userRole} />
        
      <div className='addashcontent'>
        <div className='adtopbox'>
          <div className='adtopbox1'>


          </div>
          <div className='adtopbox2'>
            <h4>Scheduled Meetings</h4>
            <p className='adcounting'>{todayMeetings.length} meetings today</p>
          </div>
          <div className='adtopbox3'>
          
          </div>
          <div className='adtopbox4' onClick={toggleAform}>
           <h4>Manage user roles</h4>
          </div>
        </div>
        <div className='adleftside'>

        <div className='addashtainer1'>
          <h4>Notifications</h4>
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.ticketId)}  // Click handler to navigate
                  style={{ cursor: 'pointer', textDecoration: 'none',
                    padding: '10px',
            backgroundColor: 'black',
            color: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '10px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease',}}  // Style to make it clickable
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

        <div className='addashtainer2'>
            <div className='budgettracker'>
              <MeetingScheduler />
            {/* <BudgetTracker /> */}
            </div>
          </div>

        </div>
       

  
        
     
        {isAssessVisible && ( // Conditional rendering
           <div className="overlay">
           <div className="form-container" ref={aRef}>
             <ManageUserRoles onClose={toggleAform} />
           </div>
         </div>
          )}
      </div>
    </div>
  );
};

export default ADDashUser;

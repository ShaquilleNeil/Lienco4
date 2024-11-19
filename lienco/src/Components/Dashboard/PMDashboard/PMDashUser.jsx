import React, { useState, useEffect } from 'react';
import './PMDashUser.css';
import Header from '../Header.jsx';
import Sidebar from '../SideBar.jsx';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Import useNavigate to handle routing
import BudgetTracker from '../../Resources/budgettracker.jsx';
import MeetingScheduler from './meetingscheduler.jsx';
import Chart from './chart.jsx'
import Rchart from './rchart.jsx';

const DashUser = ({ onLogout, userRole, spentAmount, totalAmount,resourceData }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();  // Initialize useNavigate for navigation

  const totalBudget = 50000; // Example total budget
  const usedBudget = 25000;  // Example used budget
  const percentageUsed = (usedBudget / totalBudget) * 100;

  const percentageSpent = (spentAmount / totalAmount) * 100;

  // Handle notification click to navigate to the ticket
  const handleNotificationClick = (ticketId) => {
    navigate(`/pdash`);  // Navigate to the ticket page with ticketId in URL
  };

  useEffect(() => {
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
  

          </div>
          <div className='topbox2'>
            <h4>{unreadCount} unread notifications</h4>
          </div>
          <div className='topbox3'>
            <Rchart   title="Resource Usage"
          percentage={percentageSpent.toFixed(2)} />
          </div>
          <div className='topbox4'>
            <Chart   title="Budget Usage"
          percentage={percentageUsed.toFixed(2)} />
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
                  onClick={() => handleNotificationClick(notification.ticketId)}  // Click handler to navigate
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}  // Style to make it clickable
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
            {/* <BudgetTracker /> */}
            </div>
          </div>

        </div>
       

        <div className='rghtside'>
         
          <div className='dashtainer3'>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashUser;

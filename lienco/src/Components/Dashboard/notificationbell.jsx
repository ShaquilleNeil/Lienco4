import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const notificationsRef = ref(db, 'notifications/' + user.uid);
      
      // Set up a listener for new notifications
      const unsubscribe = onValue(notificationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const notificationsArray = Object.keys(data).map(key => data[key]);
          setNotifications(notificationsArray);
          
          // Count unread notifications
          const unread = notificationsArray.filter(notification => !notification.read).length;
          setUnreadCount(unread);
        } else {
          setNotifications([]);
          setUnreadCount(0);
        }
        setLoading(false);
      });
      
      // Cleanup the listener when the component is unmounted
      return () => unsubscribe();
    }
  }, [user]);

  // Toggle the visibility of notifications
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    
    // Mark notifications as read when they are shown
    if (!showNotifications) {
      const db = getDatabase();
      notifications.forEach(notification => {
        if (!notification.read) {
          // Mark as read by updating the 'read' field
          const notificationRef = ref(db, 'notifications/' + user.uid + '/' + notification.id);
          update(notificationRef, {
            read: true, // Update only the read status
          });
        }
      });
    }
  };

  return (
    <div className="notification-bell">
      <button onClick={toggleNotifications} className="bell-button">
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </button>

      {/* Show notifications modal */}
      {showNotifications && (
        <div className="notifications-modal">
          <h4>Notifications</h4>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.id}>
                    <p>{notification.message}</p>
                    <small>{new Date(notification.timestamp).toLocaleString()}</small>
                  </li>
                ))
              ) : (
                <p>No new notifications</p>
              )}
            </ul>
          )}
          <button onClick={toggleNotifications}>Close</button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

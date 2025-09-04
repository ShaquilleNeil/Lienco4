import React, { useState, useEffect, useCallback } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();  // Initialize useNavigate

  const encodeEmail = (email) => {
    return email.replace(/\./g, '_dot_').replace(/@/g, '_at_');
  };

  useEffect(() => {
    if (user) {
      console.log("Logged in user:", user);
      const userEmail = user.email;
      console.log("User Email:", userEmail); // Check if the email is available
      if (userEmail) {
        const encodedUserId = encodeEmail(userEmail);
        const db = getDatabase();
        const notificationsRef = ref(db, `notifications/${encodedUserId}`);

        const unsubscribe = onValue(
          notificationsRef,
          (snapshot) => {
            const data = snapshot.val();
            console.log("Fetched notifications:", data);

            if (data) {
              // Convert the notifications object into an array and sort by timestamp descending
              const notificationsArray = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
              })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by timestamp descending

              setNotifications(notificationsArray);

              // Count unread notifications
              const unread = notificationsArray.filter((notification) => !notification.read).length;
              setUnreadCount(unread);
            } else {
              setNotifications([]);
              setUnreadCount(0);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching notifications:", error);
            setError("Failed to load notifications.");
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } else {
        console.log("No email found for the logged-in user.");
      }
    }
  }, [user]);

  // Remove read notifications after a delay
  useEffect(() => {
    if (notifications.length > 0) {
      const unreadNotifications = notifications.filter((n) => !n.read);
      const readNotifications = notifications.filter((n) => n.read);

      // Set a timer to remove read notifications after 30 seconds (or any other delay)
      const timer = setTimeout(() => {
        const readNotificationsToRemove = readNotifications.map((notification) => ({
          id: notification.id,
          ...notification,
        }));

        // Remove read notifications from state and update them in the database
        if (readNotificationsToRemove.length > 0) {
          const db = getDatabase();
          const updates = {};
          const encodedUserId = encodeEmail(user.email);

          // For each read notification, delete it from the database after the delay
          readNotificationsToRemove.forEach((notification) => {
            updates[`notifications/${encodedUserId}/${notification.id}`] = null;
          });

          update(ref(db), updates).catch((error) => {
            console.error('Error removing notifications:', error);
            setError('Failed to remove read notifications.');
          });

          // Update state to reflect changes
          setNotifications(notifications.filter((n) => !n.read));
        }
      }, 30000);  // Set delay to 30 seconds

      return () => clearTimeout(timer); // Clean up the timer when component unmounts
    }
  }, [notifications, user]);

  // Toggle the visibility of notifications and mark them as read when shown
  const toggleNotifications = useCallback(() => {
    setShowNotifications((prevState) => !prevState);

    if (!showNotifications && notifications.some((n) => !n.read)) {
      const db = getDatabase();
      const updates = {};
      const encodedUserId = encodeEmail(user.email);

      notifications.forEach((notification) => {
        if (!notification.read) {
          updates[`notifications/${encodedUserId}/${notification.id}/read`] = true;
        }
      });

      update(ref(db), updates).catch((error) => {
        console.error('Error updating notifications:', error);
        setError('Failed to update notifications.');
      });
    }
  }, [notifications, showNotifications, user]);

  // Handle notification click and navigate to ticket
  const handleNotificationClick = (ticketId) => {
    navigate(`/pdash`);  // Navigate to the ticket page
  };

  return (
    <div className="notification-bell">
      <button
        onClick={toggleNotifications}
        className="bell-button"
        aria-label="Notifications"
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </button>

      {/* Show notifications modal */}
      {showNotifications && (
        <div className="notifications-modal">
          <h4 >Notifications</h4>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <ul>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    onClick={() => handleNotificationClick(notification.ticketId)} // Add click handler
                    style={{ cursor: 'pointer', textDecoration: 'none' }} // Make it look clickable
                  >
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

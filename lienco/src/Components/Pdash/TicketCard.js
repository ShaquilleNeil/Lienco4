import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { getDatabase, ref, push, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ProgressDisplay from './ProgressDisplay';
import StatusDisplay from './StatusDisplay';
import AvatarDisplay from './AvatarDisplay';
import DeleteBlock from './DeleteBlock';
import './tcard.css';

const TicketCard = ({ color, ticket }) => {
  const [showModal, setShowModal] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatesHistory, setUpdatesHistory] = useState([]);
  const [commentsHistory, setCommentsHistory] = useState({});
  const [showComments, setShowComments] = useState({});
  const [userRole, setUserRole] = useState('user');
  const [userEmail, setUserEmail] = useState('');

  const auth = getAuth();

  // Fetch user role directly from Firestore using the userId as document ID
  const fetchUserRole = async (userId) => {
    try {
      const roleDoc = await getDoc(doc(db, 'Roles', userId));
      if (roleDoc.exists()) {
        const userRoleData = roleDoc.data().Role;
        setUserRole(userRoleData || 'user');
      } else {
        console.log('Role not found for userId:', userId, ', defaulting to "user".');
        setUserRole('user');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user');
    }
  };

  // Add a notification to the Realtime Database
// Add notification under the assigned user's node
// Helper function to encode email as Firebase-compatible path
const encodeEmail = (email) => {
  return email.replace(/\./g, '_dot_').replace(/@/g, '_at_');
};

// Add notification under the assigned user's node
const addNotification = async (message, userId) => {
  if (!userId) {
    console.error('User ID is undefined, cannot add notification');
    return;
  }

  try {
    // Encode email to make it a valid Firebase path
    const encodedUserId = encodeEmail(userId);

    const database = getDatabase();
    const notificationsRef = ref(database, `notifications/${encodedUserId}`); // Use encoded email as path
    const newNotificationRef = push(notificationsRef);

    await set(newNotificationRef, {
      id: newNotificationRef.key,
      message,
      read: false,
      timestamp: new Date().toISOString(),
    });
    console.log('Notification added for user:', encodedUserId);
  } catch (error) {
    console.error('Error adding notification:', error);
  }
};

// Handle adding updates
// Handle adding updates
const handleAddUpdate = async () => {
  setLoading(true);
  try {
    const updatesCollection = collection(db, 'TicketUpdates');

    // Get the assigned user's email or ID
    const assignedUserId = ticket.assignedUser;

    // Create the update document
    await addDoc(updatesCollection, {
      ticketId: ticket.documentId,
      updateText,
      timestamp: new Date().toISOString(),
      assignedUser: assignedUserId, // Store the assigned user's ID or email
    });

    setUpdateText(''); // Clear the update input field
    fetchUpdatesHistory(); // Refresh update history

    // Notify assigned user when project manager updates
    if (userRole === "project manager" && assignedUserId !== userEmail) {
      await addNotification(
        `A new update was added to your ticket "${ticket.title}" by the Project Manager.`,
        assignedUserId // Notify the user assigned to the ticket
      );
    }

    // Notify project manager when update is added by someone else
    const createdByEmail = ticket.createdByEmail;
    if (createdByEmail && userRole !== "project manager" && userEmail !== createdByEmail) {
      await addNotification(
        `A new update was added to your ticket "${ticket.title}" by ${userRole}.`,
        createdByEmail // Notify the project manager who created the ticket
      );
    }
  } catch (error) {
    console.error('Error saving update:', error);
  } finally {
    setLoading(false);
  }
};

// Handle adding comments
const handleAddComment = async (updateId) => {
  setLoading(true);
  try {
    const commentsCollection = collection(db, `TicketUpdates/${updateId}/Comments`);
    
    // Add the comment to Firestore
    await addDoc(commentsCollection, {
      commentText,
      timestamp: new Date().toISOString(),
    });

    setCommentText(''); // Clear the comment input field
    fetchComments(updateId); // Refresh comments history

    // Notify the assigned user when a project manager comments
    if (userRole === "project manager" && ticket.assignedUser !== userEmail) {
      await addNotification(
        `A new comment was added to your ticket "${ticket.title}" by the Project Manager. Comment: "${commentText}"`,
        ticket.assignedUser // Notify the user assigned to the ticket
      );
    }

    // Notify the project manager when someone else (other than themselves) comments
    const createdByEmail = ticket.createdByEmail;
    if (createdByEmail && userRole !== "project manager" && userEmail !== createdByEmail) {
      await addNotification(
        `A new comment was added to your ticket "${ticket.title}" by ${userRole}. Comment: "${commentText}"`,
        createdByEmail // Notify the project manager who created the ticket
      );
    }
  } catch (error) {
    console.error('Error saving comment:', error);
  } finally {
    setLoading(false);
  }
};



  // Fetch the update history for the ticket in real-time
  const fetchUpdatesHistory = () => {
    const updatesCollection = collection(db, 'TicketUpdates');
    const q = query(updatesCollection, where('ticketId', '==', ticket.documentId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUpdatesHistory(updates);
    });
    return unsubscribe; // Clean up listener when component unmounts
  };

  // Fetch comments for a specific update in real-time
  const fetchComments = (updateId) => {
    const commentsCollection = collection(db, `TicketUpdates/${updateId}/Comments`);
    const unsubscribe = onSnapshot(commentsCollection, (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommentsHistory((prev) => ({
        ...prev,
        [updateId]: comments,
      }));
    });
    return unsubscribe; // Clean up listener when component unmounts
  };

  // Fetch role and set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); 
        fetchUserRole(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Set up real-time updates fetching
  useEffect(() => {
    let unsubscribe;
    if (showModal) {
      unsubscribe = fetchUpdatesHistory();
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [showModal]);

  return (
    <div className="ticket-card">
      <div className="ticket-color" style={{ backgroundColor: color }}></div>

      <Link
        to={`/ticket/${ticket.documentId}`}
        id="link"
        state={{ editMode: userRole !== 'user' }}
        className="link-no-underline"
      >
        <h3>{ticket.title}</h3>
        <AvatarDisplay ticket={ticket} />
        <StatusDisplay status={ticket.status} />
        <ProgressDisplay progress={Number(ticket.progress)} />
      </Link>

      <DeleteBlock documentId={ticket.documentId} />

      <div className="add-update-section">
        <button onClick={() => setShowModal(true)}>
          {userRole === 'user' ? 'View Updates & Comment' : 'Add Update'}
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{userRole === 'user' ? 'Update History' : 'Add Update for ' + ticket.title}</h3>

            {userRole === 'project manager' && (
              <>
                <textarea
                  placeholder="Describe what was done..."
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  rows="4"
                  style={{ width: '100%' }}
                />
                <button onClick={handleAddUpdate} disabled={loading || !updateText.trim()}>
                  {loading ? 'Saving...' : 'Save Update'}
                </button>
              </>
            )}

            <h4>Update History</h4>
            <div style={{ maxHeight: '300px', width: '540px', overflowY: 'auto' }}>
              <ul>
                {updatesHistory.map((update) => (
                  <li key={update.id} className="update-item">
                    <p>{update.updateText}</p>
                    <small>{new Date(update.timestamp).toLocaleString()}</small>

                    <div>
                      <span
                        onClick={() => {
                          setShowComments((prev) => ({
                            ...prev,
                            [update.id]: !prev[update.id],
                          }));
                          if (!showComments[update.id]) fetchComments(update.id);
                        }}
                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                      >
                        {showComments[update.id] ? 'Hide Comments' : 'View Comments'}
                      </span>
                    </div>

                    {showComments[update.id] && (
                      <div className="comments-section">
                        {commentsHistory[update.id]?.map((comment) => (
                          <div key={comment.id} className="comment-item">
                            <p>{comment.commentText}</p>
                            <small>{new Date(comment.timestamp).toLocaleString()}</small>
                          </div>
                        ))}
                        <textarea
                          placeholder="Add a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows="2"
                          style={{ width: '90%', height: '40px' }}
                        />
                        <button
                          onClick={() => handleAddComment(update.id)}
                          disabled={loading || !commentText.trim()}
                        >
                          {loading ? 'Saving...' : 'Add Comment'}
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCard;

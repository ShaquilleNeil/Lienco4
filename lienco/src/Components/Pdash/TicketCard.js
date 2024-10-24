import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import ProgressDisplay from './ProgressDisplay';
import StatusDisplay from './StatusDisplay';
import AvatarDisplay from './AvatarDisplay';
import DeleteBlock from './DeleteBlock';
import './tcard.css';

const TicketCard = ({ color, ticket }) => {
  const [showModal, setShowModal] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [commentText, setCommentText] = useState(''); // State for user comments
  const [loading, setLoading] = useState(false);
  const [updatesHistory, setUpdatesHistory] = useState([]);
  const [userRole, setUserRole] = useState(''); // State for user role

  const auth = getAuth();

  // Fetch the user's role from Firestore
  const fetchUserRole = async (userId) => {
    try {
      const rolesCollection = collection(db, 'Roles');
      const q = query(rolesCollection, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const userRoleData = snapshot.docs[0]?.data()?.role;
      setUserRole(userRoleData || 'user'); // Default to 'user' if no role is found
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const handleAddUpdate = async () => {
    setLoading(true);
    try {
      const updatesCollection = collection(db, 'TicketUpdates');
      await addDoc(updatesCollection, {
        ticketId: ticket.documentId,
        updateText,
        timestamp: new Date().toISOString(),
      });
      setUpdateText('');
      fetchUpdatesHistory(); // Refresh updates after adding
    } catch (error) {
      console.error('Error saving update:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (updateId) => {
    setLoading(true);
    try {
      const commentsCollection = collection(db, `TicketUpdates/${updateId}/Comments`);
      await addDoc(commentsCollection, {
        commentText,
        timestamp: new Date().toISOString(),
      });
      setCommentText('');
      fetchUpdatesHistory(); // Refresh updates after adding comment
    } catch (error) {
      console.error('Error saving comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdatesHistory = async () => {
    const updatesCollection = collection(db, 'TicketUpdates');
    const q = query(updatesCollection, where('ticketId', '==', ticket.documentId));
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUpdatesHistory(updates);
  };

  useEffect(() => {
    // Fetch user role once on component mount
    const user = auth.currentUser;
    if (user) {
      fetchUserRole(user.uid);
    }
  }, [auth.currentUser]);

  useEffect(() => {
    if (showModal) {
      fetchUpdatesHistory();
    }
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

            {userRole !== 'user' && (
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
            <ul>
              {updatesHistory.map(update => (
                <li key={update.id} className="update-item">
                  <p>{update.updateText}</p>
                  <small>{new Date(update.timestamp).toLocaleString()}</small>

                  {userRole === 'user' && (
                    <div className="comment-section">
                      <textarea
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows="2"
                        style={{ width: '100%' }}
                      />
                      <button onClick={() => handleAddComment(update.id)} disabled={loading || !commentText.trim()}>
                        {loading ? 'Saving...' : 'Add Comment'}
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCard;

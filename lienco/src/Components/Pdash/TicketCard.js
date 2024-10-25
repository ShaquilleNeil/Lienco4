import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
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
  const [commentsHistory, setCommentsHistory] = useState({}); // Store comments by update ID
  const [showComments, setShowComments] = useState({}); // Track which update's comments are visible
  const [userRole, setUserRole] = useState('user');

  const auth = getAuth();

  // Fetch user role directly from Firestore using the userId as document ID
  const fetchUserRole = async (userId) => {
    try {
      const roleDoc = await getDoc(doc(db, 'Roles', userId)); // Fetch role using the userId as the document ID
      if (roleDoc.exists()) {
        const userRoleData = roleDoc.data().Role; // Get the role from the document
        setUserRole(userRoleData || 'user'); // Set the role or default to 'user' if not found
      } else {
        console.log('Role not found for userId:', userId, ', defaulting to "user".');
        setUserRole('user'); // Default to 'user' if no document exists
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user'); // Handle error by defaulting to 'user'
    }
  };

  // Handle adding updates
  const handleAddUpdate = async () => {
    setLoading(true);
    try {
      const updatesCollection = collection(db, 'TicketUpdates');
      await addDoc(updatesCollection, {
        ticketId: ticket.documentId,
        updateText,
        timestamp: new Date().toISOString(),
      });
      setUpdateText(''); // Clear the update input field
      fetchUpdatesHistory(); // Refresh history after adding update
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
      await addDoc(commentsCollection, {
        commentText,
        timestamp: new Date().toISOString(),
      });
      setCommentText(''); // Clear the comment input field
      fetchComments(updateId); // Refresh comments history to include the new comment
    } catch (error) {
      console.error('Error saving comment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the update history for the ticket
  const fetchUpdatesHistory = async () => {
    const updatesCollection = collection(db, 'TicketUpdates');
    const q = query(updatesCollection, where('ticketId', '==', ticket.documentId));
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUpdatesHistory(updates); // Set updates history
  };

  // Fetch comments from the Comments sub-collection
  const fetchComments = async (updateId) => {
    try {
      const commentsCollection = collection(db, `TicketUpdates/${updateId}/Comments`);
      const commentsSnapshot = await getDocs(commentsCollection);
      const comments = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCommentsHistory(prev => ({ ...prev, [updateId]: comments })); // Store comments for the specific update
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Fetch role and set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserRole(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Debugging - Log userRole to confirm it is being set correctly
  useEffect(() => {
    console.log('Fetched user role:', userRole); // Check if 'project manager' is shown here
  }, [userRole]);

  // Fetch update history when modal is opened
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
            <div style={{ maxHeight: '300px', width: '540px', overflowY: 'auto' }}> {/* Scrollable area */}
              <ul>
                {updatesHistory.map(update => (
                  <li key={update.id} className="update-item">
                    <p>{update.updateText}</p>
                    <small>{new Date(update.timestamp).toLocaleString()}</small>

                    {/* View Comments Link */}
                    <div>
                      <span 
                        onClick={() => { 
                          setShowComments(prev => ({ ...prev, [update.id]: !prev[update.id] })); 
                          if (!showComments[update.id]) fetchComments(update.id); // Fetch comments when showing them
                        }} 
                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                      >
                        {showComments[update.id] ? 'Hide Comments' : 'View Comments'}
                      </span>
                    </div>

                    {showComments[update.id] && (
                      <div className="comments-section">
                        {commentsHistory[update.id] && commentsHistory[update.id].map(comment => (
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
                          style={{ width: '90%', height: '40px' }} // Small text area for comments
                        />
                        <button onClick={() => handleAddComment(update.id)} disabled={loading || !commentText.trim()}>
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

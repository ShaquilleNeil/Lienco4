import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure you're importing your Firestore instance correctly
import React, { useState } from 'react';

const DeleteBlock = ({ documentId, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Delete ticket function
  const deleteTicket = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      // Reference to the document in Firestore
      const ticketDocRef = doc(db, 'tickets', documentId);
      
      // Delete the document from Firestore
      await deleteDoc(ticketDocRef);
      
      // Notify parent component to update UI
      onDelete(documentId);
    } catch (err) {
      console.error('Error deleting ticket:', err);
      setError('An error occurred while deleting the ticket.');
    } finally {
      setLoading(false); // Set loading state to false after completion
    }
  };

  return (
    <div className="delete-block">
      {/* Button/Icon that triggers delete */}
      <div
        className="delete-icon"
        onClick={deleteTicket} 
        style={{ cursor: 'pointer' }} // Ensure pointer cursor is visible
      >
        {loading ? 'Deleting...' : '✖'}
      </div>
      {/* Show error message if any */}
      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default DeleteBlock;

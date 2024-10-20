import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import './useroles.css'; // Import the CSS file

const ManageUserRoles = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success messages

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const userCollectionRef = collection(db, 'Roles'); // Ensure this is your users collection
      const userSnapshot = await getDocs(userCollectionRef);
      const userList = userSnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, email: data.Email || '', role: data.Role || '' }; // Ensure these fields exist
      });
      setUsers(userList);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'Roles', userId);
      await updateDoc(userRef, { Role: newRole });
      setSuccessMessage(`Role updated successfully for ${newRole}`); // Set success message
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update role');
    }
  };

  return (
    <div className="manage-user-roles">
      <h2>Manage User Roles</h2>
      {loading && <p className="loading-message">Loading users...</p>}
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
      <ul className="user-list">
        {users.map(user => (
          <li key={user.id} className="user-item">
            <span>{user.email}</span>
            <select
              className="user-role-select"
              defaultValue={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
            >
              <option value="">Select Role</option> {/* Default option */}
              <option value="admin">Admin</option>
              <option value="project manager">Project Manager</option>
              <option value="user">User</option>
            </select>
            <button
              className="update-role-button"
              onClick={() => handleRoleChange(user.id, user.role)}
              disabled={user.role === ''} // Disable if no role selected
            >
              Update Role
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUserRoles;

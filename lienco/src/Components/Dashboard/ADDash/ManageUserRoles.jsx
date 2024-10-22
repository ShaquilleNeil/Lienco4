import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Adjust the path as needed
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import './useroles.css'; // Import the CSS file

const ManageUserRoles = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const userCollectionRef = collection(db, 'Roles');
      const userSnapshot = await getDocs(userCollectionRef);
      const userList = userSnapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, email: data.Email || '', role: data.Role || '' };
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

  const handleRoleChange = async (userId, newRole,email) => {
    try {
      const userRef = doc(db, 'Roles', userId);
      await updateDoc(userRef, { Role: newRole });
      setSuccessMessage(`Role updated successfully for ${email}`);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update role');
    }
  };

  return (
    <div className="form-content">
      <button className="close-btn" onClick={onClose}>X</button>
      <h2>Manage User Roles</h2>
      {loading && <p>Loading users...</p>}
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <span>{user.email}</span>
            <select
              className="user-role-select"
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value,user.email)}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="project manager">Project Manager</option>
              <option value="user">User</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUserRoles;

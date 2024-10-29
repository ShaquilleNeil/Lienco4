import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CategoriesContext from './context';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, getDoc, getDocs } from 'firebase/firestore';
import Header from '../Dashboard/Header.jsx';
import Sidebar from '../Dashboard/SideBar.jsx';
import './ticketpage.css';
import { auth } from '../firebase'; // Ensure you import Firebase auth
import { onAuthStateChanged } from 'firebase/auth'; // Import the auth state change listener

const fetchUserRole = async (userId) => {
  const roleDoc = await getDoc(doc(db, 'Roles', userId)); // Fetch role document using user ID
  if (roleDoc.exists()) {
    return roleDoc.data().role; // Return the role if document exists
  } else {
    console.log('No such document!');
    return null; // Return null if no document found
  }
};




const TicketPage = () => {
  const location = useLocation();
  const editMode = location.state?.editMode || false; // Use location state to determine edit mode

  const [categories, setCategories] = useState([]); // State for categories
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '', // This should match the field in Firestore
    newCategory: '',
    priority: 1,
    status: 'not started',
    progress: 0,
    owner: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [userRole, setUserRole] = useState(null);

  // Function to fetch categories from Firestore
// Function to fetch categories from Firestore
const fetchCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tickets')); // Replace with your collection name
    const categoriesArray = [];

    querySnapshot.forEach((doc) => {
      const category = doc.data().category; // Get category
      if (category && !categoriesArray.includes(category)) { // Check if the category is not already included
        categoriesArray.push(category); // Push category without quotes
      }
    });

    setCategories(categoriesArray); // Set unique categories
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const handleLogout = async () => {
  try {
    await auth.signOut(); // Sign out from Firebase
    setUserRole(null); // Reset user role on logout
    navigate('/'); 
  } catch (error) {
    console.error("Logout failed: ", error.message); // Log the error message
  }
};

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const role = await fetchUserRole(user.uid); // Fetch role on successful login
      setUserRole(role);
    } else {
      setUserRole(null);
    }
    setLoading(false); // Set loading to false after fetching user role
  });

  return () => unsubscribe();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editMode) {
        const ticketRef = doc(db, 'tickets', id);
        await updateDoc(ticketRef, formData);
      } else {
        await addDoc(collection(db, 'tickets'), formData);
      }
      navigate('/pdash', { state: { refresh: true } });
    } catch (error) {
      console.error('Submission failed:', error);
      setError(`Failed to submit the ticket: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const ticketRef = doc(db, 'tickets', id);
      const ticketDoc = await getDoc(ticketRef);
      if (ticketDoc.exists()) {
        setFormData(ticketDoc.data());
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the component mounts
    if (editMode) {
      fetchData();
    }
  }, [editMode]);

  return (
    <div className="ticket">
      <Header onLogout={handleLogout} />
      <Sidebar userRole={userRole} />
      <h1>{editMode ? 'Update Your Ticket' : 'Create a Ticket'}</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="ticket-container">
        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              onChange={handleChange}
              required
              value={formData.title}
            />

            <label htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              onChange={handleChange}
              required
              value={formData.description}
            />

            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label htmlFor="new-category">New Category</label>
            <input
              id="new-category"
              name="newCategory"
              type="text"
              onChange={handleChange}
            />

            <label>Priority</label>
            <div className="multiple-input-container">
              {[1, 2, 3, 4, 5].map((priority) => (
                <div key={priority}>
                  <input
                    id={`priority-${priority}`}
                    name="priority"
                    type="radio"
                    onChange={handleChange}
                    value={priority}
                    checked={formData.priority == priority}
                  />
                  <label htmlFor={`priority-${priority}`}>{priority}</label>
                </div>
              ))}
            </div>

            {editMode && (
              <>
                <input
                  type="range"
                  id="progress"
                  name="progress"
                  value={formData.progress}
                  min="0"
                  max="100"
                  onChange={handleChange}
                />
                <label htmlFor="progress">Progress</label>

                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="done">Done</option>
                  <option value="working on it">Working on it</option>
                  <option value="stuck">Stuck</option>
                  <option value="not started">Not Started</option>
                </select>
              </>
            )}

            <input type="submit" disabled={loading} />
          </section>

          <section>
            <label htmlFor="owner">Owner</label>
            <input
              id="owner"
              name="owner"
              type="text"
              onChange={handleChange}
              required
              value={formData.owner}
            />

            <label htmlFor="avatar">Avatar</label>
            <input
              id="avatar"
              name="avatar"
              type="url"
              onChange={handleChange}
            />
            <div className="img-preview">
              {formData.avatar && (
                <img src={formData.avatar} alt="image preview" />
              )}
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default TicketPage;

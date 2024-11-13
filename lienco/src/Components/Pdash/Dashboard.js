import { useState, useEffect, useContext } from 'react';
import { db } from '../firebase'; // Import your Firestore instance
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import TicketCard from './TicketCard';
import CategoriesContext from './context';
import './pdash.css';
import Header from '../Dashboard/Header.jsx';
import Sidebar from '../Dashboard/SideBar.jsx';
import { auth } from '../firebase'; // Ensure you import Firebase auth
import { onAuthStateChanged } from 'firebase/auth'; // Import the auth state change listener
import { useNavigate } from 'react-router-dom';

const fetchUserRole = async (userId) => {
  const roleDoc = await getDoc(doc(db, 'Roles', userId)); // Fetch role document using user ID
  if (roleDoc.exists()) {
    return roleDoc.data().role; // Return the role if document exists
  } else {
    console.log('No such document!');
    return null; // Return null if no document found
  }
};

const Dashboard = () => {
  const [tickets, setTickets] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const { categories, setCategories } = useContext(CategoriesContext);
  const [userRole, setUserRole] = useState(null); // State to hold user role
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out from Firebase
      setUserRole(null); // Reset user role on logout
      navigate('/');
    } catch (error) {
      console.error("Logout failed: ", error.message); // Log the error message
    }
  };

  const fetchTickets = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tickets')); // Fetch tickets from Firestore
      const ticketsData = querySnapshot.docs.map((doc) => ({
        documentId: doc.id,
        ...doc.data(),
      }));

      // Get the logged-in user's email
      const userEmail = auth.currentUser?.email;

      // Filter tickets based on the assignedToEmail field
      const filteredTickets = ticketsData.filter(ticket => ticket.assignedUser === userEmail);

      setTickets(filteredTickets); // Set the filtered tickets to the state
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    // Fetch user role and tickets on auth state change
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await fetchUserRole(user.uid); // Fetch role on successful login
        setUserRole(role);
        fetchTickets(); // Fetch tickets for the logged-in user
      } else {
        setUserRole(null);
      }
      setLoading(false); // Set loading to false after checking user
    });

    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only on mount

  // useEffect to set categories once tickets are fetched
  useEffect(() => {
    if (tickets.length > 0) {
      setCategories([...new Set(tickets.map(({ category }) => category))]); // Set categories once tickets are available
    }
  }, [tickets, setCategories]);

  const colors = [
    'rgb(255,179,186)',
    'rgb(255,223,186)',
    'rgb(255,255,186)',
    'rgb(186,255,201)',
    'rgb(186,225,255)',
  ];

  const uniqueCategories = [...new Set(tickets.map(({ category }) => category))];

  if (loading) return <p>Loading...</p>; // Show loading state

  return (
    <div className="pdash">
      <Header onLogout={handleLogout} />
      <Sidebar userRole={userRole} /> {/* Pass userRole to Sidebar */}
      <h1>My Projects</h1>
      <div className="ticket-container">
        {uniqueCategories.length > 0 ? (
          uniqueCategories.map((uniqueCategory, categoryIndex) => (
            <div key={categoryIndex}>
              <h2>{uniqueCategory}</h2>
              {tickets
                .filter((ticket) => ticket.category === uniqueCategory)
                .map((filteredTicket) => (
                  <TicketCard
                    key={filteredTicket.documentId}
                    color={colors[categoryIndex] || colors[0]}
                    ticket={filteredTicket}
                  />
                ))}
            </div>
          ))
        ) : (
          <p>No tickets available.</p> // Handle case where no tickets are present
        )}
      </div>
    </div>
  );
};

export default Dashboard;

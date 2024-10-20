import { useState, useEffect, useContext } from 'react';
import { db } from '../firebase'; // Import your Firestore instance
import { collection, getDocs } from 'firebase/firestore';
import TicketCard from './TicketCard';
import CategoriesContext from './context';
import './pdash.css';
import Header from '../Dashboard/Header.jsx'
import Sidebar from '../Dashboard/SideBar.jsx'

const Dashboard = () => {
  const [tickets, setTickets] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const { categories, setCategories } = useContext(CategoriesContext);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tickets')); // Fetch tickets from Firestore
        const ticketsData = querySnapshot.docs.map((doc) => ({
          documentId: doc.id,
          ...doc.data(),
        }));

        setTickets(ticketsData);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    if (tickets.length > 0) {
      setCategories([...new Set(tickets.map(({ category }) => category))]);
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
      <Header />
      <Sidebar />
      <h1>My Projects</h1>
      <div className="ticket-container">
        {uniqueCategories.length > 0 ? (
          uniqueCategories.map((uniqueCategory, categoryIndex) => (
            <div key={categoryIndex}>
              <h3>{uniqueCategory}</h3>
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

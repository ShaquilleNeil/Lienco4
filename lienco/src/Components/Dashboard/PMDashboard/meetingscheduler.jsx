import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { db } from '../../firebase';  // Import your Firebase config
import { collection, getDocs, addDoc, getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import './meeting.css';
import { Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const localizer = momentLocalizer(moment); // Initialize the localizer

const MeetingScheduler = ({ onMeetingScheduled }) => {
  const [events, setEvents] = useState([]); // Store events for calendar
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [meetingDetails, setMeetingDetails] = useState('');
  const [users, setUsers] = useState([]);  // Store the emails of users
  const [loading, setLoading] = useState(true);  // Loading state for fetching users
  const [userRole, setUserRole] = useState('');  // Store the current user's role

  // Fetch users' emails from Firestore
  const fetchUsers = async () => {
    try {
      const userCollectionRef = collection(db, 'Roles'); // Adjust collection path if needed
      const userSnapshot = await getDocs(userCollectionRef);
      const userList = userSnapshot.docs.map(doc => doc.data().Email); // Assuming Email field is in each document
      setUsers(userList);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events from Firestore to display on page load
  const fetchEvents = async () => {
    try {
      const db = getFirestore(); // Initialize Firestore
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        // Fetch the user's role from Firestore
        const userDocRef = doc(db, 'Roles', user.uid); // Assuming 'Roles' collection uses user UID as document ID
        const userDoc = await getDoc(userDocRef);
        const userRole = userDoc.exists() ? userDoc.data().role : null;
        setUserRole(userRole);  // Store user role

        const meetingsRef = collection(db, 'meetings'); // Store meetings in 'meetings' collection
        const eventSnapshot = await getDocs(meetingsRef);
        const eventList = eventSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            title: data.title,
            // If Firestore stores timestamps, convert them to JavaScript Date objects
            start: data.start instanceof Timestamp ? data.start.toDate() : new Date(data.start),
            end: data.end instanceof Timestamp ? data.end.toDate() : new Date(data.end),
            userEmail: data.userEmail,
          };
        });

        // Filtering logic based on user role
        let filteredEvents;
        if (userRole === 'project manager') {
          // Show all events for project manager
          filteredEvents = eventList;
        } else {
          // Show only events that belong to the logged-in user
          filteredEvents = eventList.filter(event => event.userEmail === user.email);
        }

        console.log("Fetched Events from Firestore:", filteredEvents); // Debugging line
        setEvents(filteredEvents);
      } else {
        console.error("No user is currently signed in.");
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  // Fetch events when the component mounts
  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
    fetchEvents(); // Fetch events from Firestore when the component mounts
  }, []);

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo.start);
  };

  const handleScheduleMeeting = async () => {
    if (userEmail && meetingDetails && selectedSlot) {
      try {
        // Add the new meeting to Firestore
        await addDoc(collection(db, 'meetings'), {
          title: `Meeting: ${meetingDetails}`,
          start: selectedSlot,
          end: moment(selectedSlot).add(1, 'hour').toDate(), // Example: 1-hour meeting
          userEmail: userEmail,
        });

        // Update the events locally to avoid fetching them immediately
        setEvents(prevEvents => [
          ...prevEvents,
          {
            title: `Meeting: ${meetingDetails}`,
            start: selectedSlot,
            end: moment(selectedSlot).add(1, 'hour').toDate(),
            userEmail: userEmail,
          },
        ]);

        if (onMeetingScheduled) onMeetingScheduled();
        setUserEmail('');
        setMeetingDetails('');
        setSelectedSlot(null);
        alert('Meeting scheduled successfully!');
      } catch (error) {
        console.error('Error scheduling meeting:', error);
      }
    } else {
      alert('Please fill all fields and select a date.');
    }
  };

  return (
    <div>
      <h3 style={{ color: 'white' }}>Schedule a Meeting</h3>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 300, margin: '20px 0', width: '900px' }}
      />
      <div>
        <label className="cal">
          Selected Date:
          <strong>{selectedSlot ? moment(selectedSlot).format('LL') : 'None'}</strong>
        </label>
      </div>

      {/* Only show the fields below the calendar if the user is not a 'user' */}
      {userRole !== 'project manager' || userRole !== 'admin' && (
        <>
          <div className='below'>
            <label className="cal">
              User Email:
              {loading ? (
                <p>Loading users...</p>
              ) : (
                <select
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="email-dropdown"
                >
                  <option value="">Select User Email</option>
                  {users.map((email, index) => (
                    <option key={index} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
              )}
            </label>
          </div>
          <div className='below2'>
            <label className="cal">
              Meeting Details:
              <textarea className='mdet'
                type="text"
                value={meetingDetails}
                onChange={(e) => setMeetingDetails(e.target.value)}
                placeholder="Enter meeting details"
              />
            </label>
          </div>
          <button className="calbutton" onClick={handleScheduleMeeting}>
            Schedule Meeting
          </button>
        </>
      )}
    </div>
  );
};

export default MeetingScheduler;

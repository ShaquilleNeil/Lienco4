import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { db } from '../../firebase';  // Import your Firebase config
import { collection, getDocs, addDoc } from 'firebase/firestore'; // Import Firestore methods
import './meeting.css';
import { Timestamp } from 'firebase/firestore';

const localizer = momentLocalizer(moment); // Initialize the localizer

const MeetingScheduler = ({ onMeetingScheduled }) => {
  const [events, setEvents] = useState([]); // Store events for calendar
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [meetingDetails, setMeetingDetails] = useState('');
  const [users, setUsers] = useState([]);  // Store the emails of users
  const [loading, setLoading] = useState(true);  // Loading state for fetching users

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
// Fetch events from Firestore to display on page load
const fetchEvents = async () => {
    try {
      const eventCollectionRef = collection(db, 'meetings'); // Store meetings in 'meetings' collection
      const eventSnapshot = await getDocs(eventCollectionRef);
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
      console.log("Fetched Events from Firestore:", eventList); // Debugging line
      setEvents(eventList);
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
      <div>
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
      <div>
        <label className="cal">
          Meeting Details:
          <input
            type="text"
            value={meetingDetails}
            onChange={(e) => setMeetingDetails(e.target.value)}
            placeholder="Enter meeting details"
          />
        </label>
      </div>
      <button className="calb" onClick={handleScheduleMeeting}>
        Schedule Meeting
      </button>
    </div>
  );
};

export default MeetingScheduler;

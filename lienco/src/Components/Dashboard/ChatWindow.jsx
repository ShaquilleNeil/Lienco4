import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase"; // Update path if needed
import { collection, query, where, getDocs, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

const ChatWindow = () => {
  const [role, setRole] = useState("");  // Role selected in the first dropdown
  const [selectedUser, setSelectedUser] = useState("");  // User selected for chatting
  const [users, setUsers] = useState([]);  // Users fetched based on selected role
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(false);
  const messagesEndRef = useRef(null); // Scroll to bottom of messages
  const [activeChat, setActiveChat] = useState("");
  const [isAdminOrPM, setIsAdminOrPM] = useState(false); // Track if logged-in user is Admin or PM

  // Fetch current user's role on component mount
  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Assuming the user's role is stored in a Firestore collection named "Roles"
          const userDocRef = query(collection(db, "Roles"), where("email", "==", user.email));
          const querySnapshot = await getDocs(userDocRef);
          if (!querySnapshot.empty) {
            const userRole = querySnapshot.docs[0].data().role; // Assuming 'role' is stored in the document
            if (userRole === "admin" || userRole === "project manager") {
              setIsAdminOrPM(true); // Set to true if user is Admin or Project Manager
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, []);

  // Fetch users based on selected role
  useEffect(() => {
    const fetchUsers = async () => {
      if (!role) return; // Skip fetching if no role is selected

      const normalizedRole = role.toLowerCase();
      const q = query(collection(db, "Roles"), where("Role", "==", normalizedRole));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(userList); // Set the users in the state based on the selected role
    };

    fetchUsers();
  }, [role]);

  // Fetch message history when selectedUser changes
  useEffect(() => {
    if (!selectedUser) {
      setMessages([]); // Clear messages if no user is selected
      return;
    }

    const q = query(
      collection(db, "Chats"),
      where("receiver", "in", [selectedUser, auth.currentUser?.email]),
      where("sender", "in", [selectedUser, auth.currentUser?.email])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
      setUnreadMessages(true); // New message is received, set unread indicator
    });

    return () => unsubscribe();
  }, [selectedUser]);

  // Scroll to the bottom when a new message is received
  useEffect(() => {
    if (unreadMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle message sending
  const handleSendMessage = async () => {
    if (!selectedUser || message.trim() === "") return;

    try {
      await addDoc(collection(db, "Chats"), {
        sender: auth.currentUser?.email,
        receiver: selectedUser,
        message,
        timestamp: serverTimestamp(),
      });

      setMessage(""); // Clear message input
      setUnreadMessages(false); // Reset unread messages once message is sent
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Mark the chat as active when a user clicks on it
  const handleSetActiveChat = (userEmail) => {
    setActiveChat(userEmail);
    setUnreadMessages(false); // Reset unread messages indicator when user opens chat
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "100px",
        right: "20px",
        backgroundColor: "white",
        padding: "20px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        width: "300px",
    
      }}
    >
      {/* Role Selection */}
      <select
        onChange={(e) => setRole(e.target.value)}
        value={role}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <option value="">Who do you want to speak to?</option>
        <option value="admin">Admin</option>
        <option value="project manager">Project Manager</option>
        <option value="user">Client</option>
      </select>

      {/* Log users to check if they are fetched */}
      {users.length === 0 && <p>No users found</p>}

      {/* User Selection based on Role */}
      <select
        onChange={(e) => {
          const user = e.target.value;
          setSelectedUser(user);
          handleSetActiveChat(user); // Set the chat as active
        }}
        value={selectedUser}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <option value="">Select a {role}</option>
        {users && users.length > 0 ? (
          users.map((user) => (
            <option
              key={user.id}
              value={user.Email}
              style={{
                fontWeight: activeChat === user.Email ? "bold" : "normal", // Highlight active chat
                color: unreadMessages && activeChat !== user.Email ? "red" : "black", // Indicator for unread
              }}
            >
              {user.Email}
              {unreadMessages && activeChat !== user.Email && (
                <span style={{ color: "red", marginLeft: "10px" }}>•</span> // Red dot for new message indicator
              )}
            </option>
          ))
        ) : (
          <option value="">No users found</option>
        )}
      </select>

      {/* Conditionally render the "Clients" option if logged-in user is admin or project manager */}
      {isAdminOrPM && (
        <select
          onChange={(e) => setSelectedUser(e.target.value)}
          value={selectedUser}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="user">Select Client</option>
          {/* Render the clients here if needed */}
        </select>
      )}

      {/* Message History */}
      <div
        style={{
          height: "200px",
          overflowY: "scroll",
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.slice(0).map((msg) => (
          <div key={msg.id} style={{ marginBottom: "8px" }}>
            <strong>{msg.sender}: </strong>
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{ width: "90%", padding: "10px", marginBottom: "10px" }}
      />
      <button
        onClick={handleSendMessage}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px",
          width: "100%",
        }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatWindow;

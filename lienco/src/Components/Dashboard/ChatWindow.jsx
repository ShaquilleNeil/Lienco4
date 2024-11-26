import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase"; // Update path if needed
import { collection, query, where, getDocs, addDoc,onSnapshot,serverTimestamp } from "firebase/firestore";

const ChatWindow = () => {
  const [role, setRole] = useState("");  // Default empty role
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(false);  // Track unread messages
  const messagesEndRef = useRef(null);  // To scroll to the bottom
  const [activeChat, setActiveChat] = useState("");  // To track active chat window

  // Fetch users based on the selected role (admin, project manager, user)
  useEffect(() => {
    const fetchUsers = async () => {
      if (!role) return; // Skip fetching if no role is selected

      // Normalize the selected role (lowercase)
      const normalizedRole = role.toLowerCase();
      const q = query(collection(db, "Roles"), where("Role", "==", normalizedRole));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(userList);  // Set the users in the state based on the selected role
    };

    fetchUsers();
  }, [role]);  // Fetch users whenever the selected role changes

  useEffect(() => {
    if (!selectedUser) {
      setMessages([]); // Clear messages if no user is selected
      return;
    }

    // Listen for messages both from the current user and to the selected user
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
      setUnreadMessages(true);  // New message is received, set unread indicator
    });

    return () => unsubscribe();
  }, [selectedUser]);

  useEffect(() => {
    if (unreadMessages) {
      // Scroll to the bottom if there are new messages
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!selectedUser || message.trim() === "") return;

    try {
      // Send the message to Firestore
      await addDoc(collection(db, "Chats"), {
        sender: auth.currentUser?.email,
        receiver: selectedUser,
        message,
        timestamp: serverTimestamp(),
      });
      
      setMessage(""); // Clear message input
      setUnreadMessages(false);  // Reset unread messages once message is sent
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Mark the chat as active when a user clicks on it
  const handleSetActiveChat = (userEmail) => {
    setActiveChat(userEmail);
    setUnreadMessages(false);  // Reset unread messages indicator when user opens chat
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
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="project manager">Project Manager</option>
        <option value="user">Clients</option>
      </select>

      {/* Log users to check if they are fetched */}
      {users.length === 0 && <p>No users found</p>}

      {/* User Selection based on Role */}
      <select
        onChange={(e) => {
          const user = e.target.value;
          setSelectedUser(user);
          handleSetActiveChat(user);  // Set the chat as active
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
        {/* Reverse the order of messages */}
        {messages.slice(0).reverse().map((msg) => (
          <div key={msg.id} style={{ marginBottom: "8px" }}>
            <strong>{msg.sender}: </strong>
            {msg.message}
          </div>
        ))}
        {/* Scroll to the bottom of the chat */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
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

import React, { useState } from "react";
import ChatWindow from "./ChatWindow";

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          border: "none",
        }}
      >
        💬
      </button>
      {isOpen && <ChatWindow />}
    </div>
  );
};

export default ChatBubble;

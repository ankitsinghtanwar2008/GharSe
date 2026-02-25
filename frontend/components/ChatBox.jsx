"use client";
import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const botReply = {
        text: getBotReply(input),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botReply]);
    }, 500);

    setInput("");
  };

  const getBotReply = (msg) => {
    msg = msg.toLowerCase();
    if (msg.includes("hi") || msg.includes("hello"))
      return "Hello 👋 How can I help you?";
    if (msg.includes("price"))
      return "Please contact our support for pricing details.";
    if (msg.includes("help"))
      return "Sure! Tell me what you need help with.";
    return "Sorry, I didn't understand that.";
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#10a37f",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "22px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        💬
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "300px",
            height: "400px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 0 15px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#10a37f",
              color: "white",
              padding: "10px",
              textAlign: "center",
            }}
          >
            Chat Support
          </div>

          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  borderRadius: "8px",
                  background:
                    msg.sender === "user" ? "#e1f5fe" : "#f1f1f1",
                  textAlign: msg.sender === "user" ? "right" : "left",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
            <input
              style={{ flex: 1, padding: "8px", border: "none" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
            />
            <button
              onClick={sendMessage}
              style={{
                background: "#10a37f",
                color: "white",
                border: "none",
                padding: "8px 12px",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
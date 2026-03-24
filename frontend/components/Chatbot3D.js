"use client";
import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("home");
  const [messages, setMessages] = useState([
    { text: "👋 Hi there! How can I help today?", type: "bot" }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (customText) => {
    const text = customText || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { text, type: "user" }]);

    setTimeout(() => {
      const reply = getBotReply(text.toLowerCase());
      setMessages((prev) => [...prev, { text: reply, type: "bot" }]);
    }, 500);

    setInput("");
    setTab("messages");
  };

  const getBotReply = (msg) => {
    if (msg.includes("order"))
      return "🛒 Go to chefs → select food → add to cart → checkout.";
    if (msg.includes("chef"))
      return "👨‍🍳 We provide best home chefs near you.";
    if (msg.includes("login"))
      return "🔐 Click login button at top right.";
    if (msg.includes("payment"))
      return "💳 UPI, Cards & COD available.";
    if (msg.includes("cluster"))
      return "⚡ Cluster issue? Try reconnecting.";

    return "🤖 I can help with orders, login, chefs, payments & more!";
  };

  return (
    <>
      {/* Floating Button */}
      <div onClick={() => setOpen(!open)} style={fabStyle}>
        💬
      </div>

      {open && (
        <div style={container}>
          
          {/* HEADER */}
          <div style={header}>
            <div>
              <b>GharSe Assistant</b><br />
              <small>How can we help?</small>
            </div>
            <span onClick={() => setOpen(false)} style={{ cursor: "pointer" }}>✖</span>
          </div>

          {/* HOME */}
          {tab === "home" && (
            <div style={body}>
              <div style={card}>⚠ Status: 3 open incidents</div>

              <input placeholder="Search for help..." style={search} />

              <div style={list}>
                <div style={listItem} onClick={() => sendMessage("reset password")}>Reset Password ➤</div>
                <div style={listItem} onClick={() => sendMessage("cluster help")}>Connecting to Cluster ➤</div>
                <div style={listItem} onClick={() => sendMessage("payment")}>Payment Issue ➤</div>
                <div style={listItem} onClick={() => sendMessage("order help")}>Order Help ➤</div>
              </div>

              <button style={askBtn} onClick={() => setTab("messages")}>
                Ask a question
              </button>
            </div>
          )}

          {/* CHAT */}
          {tab === "messages" && (
            <>
              <div style={chatArea}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      ...bubble,
                      background: msg.type === "bot" ? "#334155" : "#22c55e",
                      marginLeft: msg.type === "user" ? "auto" : "0"
                    }}
                  >
                    {msg.text}
                  </div>
                ))}

                <div style={{ marginTop: 10 }}>
                  <button style={chip} onClick={() => sendMessage("talk to expert")}>Talk to expert</button>
                  <button style={chip} onClick={() => sendMessage("cluster help")}>Cluster help</button>
                  <button style={chip} onClick={() => sendMessage("something else")}>Something else</button>
                </div>

                <div ref={chatEndRef}></div>
              </div>

              {/* INPUT */}
              <div style={inputBox}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask something..."
                  style={inputStyle}
                />
                <button onClick={() => sendMessage()} style={sendBtn}>➤</button>
              </div>
            </>
          )}

          {/* HELP */}
          {tab === "help" && (
            <div style={body}>
              <input placeholder="Search help..." style={search} />

              <div style={list}>
                <div style={listItem}>Atlas FAQ ➤</div>
                <div style={listItem}>Security ➤</div>
                <div style={listItem}>Billing ➤</div>
                <div style={listItem}>Login Issues ➤</div>
              </div>
            </div>
          )}

          {/* NAV (FIXED) */}
          <div style={nav}>
            <div
              style={{ ...navItem, color: tab === "home" ? "#22c55e" : "white" }}
              onClick={() => setTab("home")}
            >
              🏠<br />Home
            </div>

            <div
              style={{ ...navItem, color: tab === "messages" ? "#22c55e" : "white" }}
              onClick={() => setTab("messages")}
            >
              💬<br />Messages
            </div>

            <div
              style={{ ...navItem, color: tab === "help" ? "#22c55e" : "white" }}
              onClick={() => setTab("help")}
            >
              ❓<br />Help
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* 🔥 STYLES */

const navItem = {
  cursor: "pointer",
  textAlign: "center",
  flex: 1,
  padding: "6px",
  transition: "0.2s"
};

const inputStyle = {
  flex: 1,
  padding: "10px",
  border: "none",
  outline: "none",
  background: "#020617",
  color: "white"
};

const fabStyle = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  width: "65px",
  height: "65px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  fontSize: "26px",
  color: "white"
};

const container = {
  position: "fixed",
  bottom: "95px",
  right: "20px",
  width: "350px",
  height: "500px",
  background: "#0f172a",
  color: "white",
  borderRadius: "15px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
};

const header = {
  padding: "12px",
  background: "#020617",
  display: "flex",
  justifyContent: "space-between"
};

const body = {
  flex: 1,
  padding: "10px",
  overflowY: "auto"
};

const card = {
  background: "#1e293b",
  padding: "10px",
  borderRadius: "10px",
  marginBottom: "10px"
};

const search = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  marginBottom: "10px",
  border: "1px solid #334155",
  background: "#020617",
  color: "white"
};

const list = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const listItem = {
  padding: "10px",
  borderRadius: "10px",
  background: "#1e293b",
  cursor: "pointer"
};

const askBtn = {
  marginTop: "15px",
  width: "100%",
  padding: "10px",
  background: "#16a34a",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  color: "white"
};

const chatArea = {
  flex: 1,
  padding: "10px",
  overflowY: "auto"
};

const bubble = {
  padding: "10px",
  borderRadius: "10px",
  margin: "5px 0",
  maxWidth: "80%"
};

const inputBox = {
  display: "flex",
  borderTop: "1px solid #333"
};

const sendBtn = {
  padding: "10px",
  background: "#16a34a",
  border: "none",
  cursor: "pointer",
  color: "white"
};

const chip = {
  margin: "5px",
  padding: "6px 10px",
  borderRadius: "20px",
  border: "1px solid #334155",
  background: "#020617",
  color: "white",
  cursor: "pointer"
};

const nav = {
  display: "flex",
  justifyContent: "space-around",
  padding: "8px",
  background: "#020617",
  borderTop: "1px solid #334155"
};
"use client";
import { useState, useEffect, useRef } from "react";

// =============================================
// 🔧 APNA IMAGE URL YAHAN PASTE KAREIN
// =============================================
const MASCOT_IMAGE_URL = "/chatbotLogoWithoutbg.png";
// =============================================

/* ── Animations (injected once) ── */
const ANIM_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&display=swap');

  @keyframes _floatBob {
    0%,100% { transform: translateY(0px) rotate(-2deg); }
    50%      { transform: translateY(-10px) rotate(2deg); }
  }
  @keyframes _ripple {
    0%   { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes _bubblePop {
    0%   { transform: scale(0) translateY(10px); opacity: 0; }
    60%  { transform: scale(1.08) translateY(-2px); opacity: 1; }
    80%  { transform: scale(0.96) translateY(0); }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes _bubbleFade {
    0%   { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.85) translateY(6px); opacity: 0; }
  }
  @keyframes _dotBlink {
    0%,80%,100% { opacity: 0.2; transform: scale(0.8); }
    40%          { opacity: 1;   transform: scale(1.2); }
  }
  @keyframes _glowPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(30,47,110,0.35), 0 8px 28px rgba(30,47,110,0.22); }
    50%     { box-shadow: 0 0 0 14px rgba(30,47,110,0), 0 8px 28px rgba(30,47,110,0.22); }
  }
  @keyframes _badgePing {
    0%  { transform: scale(1); opacity: 1; }
    70% { transform: scale(1.9); opacity: 0; }
    100%{ transform: scale(1.9); opacity: 0; }
  }

  .__fab {
    width: 76px; height: 76px;
    border-radius: 50%; border: none; cursor: pointer;
    background: #fff; padding: 0; position: relative;
    animation: _floatBob 3.2s ease-in-out infinite,
               _glowPulse 2.5s ease-in-out 1.5s infinite;
    transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
    outline: none; -webkit-tap-highlight-color: transparent;
  }
  .__fab:hover  { transform: scale(1.13) translateY(-4px) !important; }
  .__fab:active { transform: scale(0.93) !important; }

  .__ripple {
    position: absolute; inset: 0; border-radius: 50%;
    background: rgba(30,47,110,0.18);
    animation: _ripple 2s ease-out infinite;
    pointer-events: none;
  }
  .__ripple:nth-child(2) { animation-delay: 0.75s; }

  .__bubble {
    background: #1E2F6E; color: #fff;
    padding: 11px 15px;
    border-radius: 18px 18px 4px 18px;
    font-size: 13px; font-weight: 700; font-family: 'Nunito', sans-serif;
    white-space: nowrap; line-height: 1.45;
    opacity: 0;
  }
  .__bubble.show { animation: _bubblePop 0.42s cubic-bezier(0.34,1.56,0.64,1) 1.2s forwards; }
  .__bubble.hide { animation: _bubbleFade 0.25s ease-in forwards; }

  .__bubble-sub { font-size: 11px; font-weight: 600; opacity: 0.72; margin-top: 2px; }

  .__dots { display: flex; gap: 4px; margin-top: 7px; }
  .__dots span {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(255,255,255,0.75);
    animation: _dotBlink 1.4s ease-in-out infinite;
  }
  .__dots span:nth-child(2) { animation-delay: 0.2s; }
  .__dots span:nth-child(3) { animation-delay: 0.4s; }

  .__badge {
    position: absolute; top: -3px; right: -3px;
    width: 18px; height: 18px;
    background: #E83030; border-radius: 50%;
    border: 2.5px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 800; color: #fff;
    font-family: 'Nunito', sans-serif;
  }
  .__badge::before {
    content: '';
    position: absolute; inset: -2px; border-radius: 50%;
    background: #E83030;
    animation: _badgePing 1.5s ease-out infinite;
    z-index: -1;
  }
`;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("home");
  const [messages, setMessages] = useState([
    { text: "👋 Hi there! How can I help today?", type: "bot" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Speech bubble states
  const [bubbleState, setBubbleState] = useState("show"); // "show" | "hide" | "hidden"
  const [showDots, setShowDots] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-show bubble, then typing dots
  useEffect(() => {
    const t1 = setTimeout(() => setShowDots(true), 3500);
    return () => clearTimeout(t1);
  }, []);

  const handleFabClick = () => {
    // Dismiss bubble on first click
    if (bubbleState === "show") {
      setBubbleState("hide");
      setTimeout(() => setBubbleState("hidden"), 260);
    }
    setOpen((prev) => !prev);
  };

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
    if (msg.includes("order"))   return "🛒 Go to chefs → select food → add to cart → checkout.";
    if (msg.includes("chef"))    return "👨‍🍳 We provide best home chefs near you.";
    if (msg.includes("login"))   return "🔐 Click login button at top right.";
    if (msg.includes("payment")) return "💳 UPI, Cards & COD available.";
    if (msg.includes("cluster")) return "⚡ Cluster issue? Try reconnecting.";
    return "🤖 I can help with orders, login, chefs, payments & more!";
  };

  return (
    <>
      {/* Inject animation CSS once */}
      <style>{ANIM_CSS}</style>

      {/* ── FLOATING BUTTON AREA ── */}
      <div style={fabWrap}>

        {/* Speech Bubble */}
        {bubbleState !== "hidden" && (
          <div className={`__bubble ${bubbleState}`}>
            Help is here: <strong>GharSe</strong> 🏠
            <div className="__bubble-sub">Kuch puchna hai? Main yahan hoon!</div>
            {showDots && (
              <div className="__dots">
                <span /><span /><span />
              </div>
            )}
          </div>
        )}

        {/* FAB Button */}
        <button
          className="__fab"
          onClick={handleFabClick}
          aria-label="Open GharSe Chat"
        >
          <span className="__ripple" />
          <span className="__ripple" />

          <img
            src={MASCOT_IMAGE_URL}
            alt="Ask Udai"
            style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%", display: "block" }}
          />

          {/* Red notification badge */}
          {!open && <span className="__badge">1</span>}
        </button>
      </div>

      {/* ── CHAT WINDOW ── */}
      {open && (
        <div style={container}>

          {/* HEADER */}
          <div style={header}>
            <div>
              <b>GharSe Assistant</b>
              <br />
              <small>How can we help?</small>
            </div>
            <span onClick={() => setOpen(false)} style={{ cursor: "pointer", fontSize: 18 }}>✖</span>
          </div>

          {/* HOME TAB */}
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
              <button style={askBtn} onClick={() => setTab("messages")}>Ask a question</button>
            </div>
          )}

          {/* MESSAGES TAB */}
          {tab === "messages" && (
            <>
              <div style={chatArea}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      ...bubble,
                      background: msg.type === "bot" ? "#334155" : "#22c55e",
                      marginLeft: msg.type === "user" ? "auto" : "0",
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

                <div ref={chatEndRef} />
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

          {/* HELP TAB */}
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

          {/* BOTTOM NAV */}
          <div style={nav}>
            <div style={{ ...navItem, color: tab === "home"     ? "#22c55e" : "white" }} onClick={() => setTab("home")}>🏠<br />Home</div>
            <div style={{ ...navItem, color: tab === "messages" ? "#22c55e" : "white" }} onClick={() => setTab("messages")}>💬<br />Messages</div>
            <div style={{ ...navItem, color: tab === "help"     ? "#22c55e" : "white" }} onClick={() => setTab("help")}>❓<br />Help</div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── STYLES ── */

const fabWrap = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "10px",
  zIndex: 1001,
};

const container = {
  position: "fixed",
  bottom: "115px",
  right: "20px",
  width: "350px",
  height: "500px",
  background: "#0f172a",
  color: "white",
  borderRadius: "15px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  zIndex: 1000,
};

const header = {
  padding: "12px",
  background: "#020617",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const body    = { flex: 1, padding: "10px", overflowY: "auto" };
const card    = { background: "#1e293b", padding: "10px", borderRadius: "10px", marginBottom: "10px" };
const search  = { width: "100%", padding: "10px", borderRadius: "10px", marginBottom: "10px", border: "1px solid #334155", background: "#020617", color: "white", boxSizing: "border-box" };
const list    = { display: "flex", flexDirection: "column", gap: "10px" };
const listItem= { padding: "10px", borderRadius: "10px", background: "#1e293b", cursor: "pointer" };
const askBtn  = { marginTop: "15px", width: "100%", padding: "10px", background: "#16a34a", border: "none", borderRadius: "10px", cursor: "pointer", color: "white", fontWeight: "bold" };
const chatArea= { flex: 1, padding: "10px", overflowY: "auto" };
const bubble  = { padding: "10px", borderRadius: "10px", margin: "5px 0", maxWidth: "80%", fontSize: "14px" };
const inputBox= { display: "flex", borderTop: "1px solid #333" };
const inputStyle = { flex: 1, padding: "10px", border: "none", outline: "none", background: "#020617", color: "white" };
const sendBtn = { padding: "10px 15px", background: "#16a34a", border: "none", cursor: "pointer", color: "white" };
const chip    = { margin: "5px", padding: "6px 12px", borderRadius: "20px", border: "1px solid #334155", background: "#020617", color: "white", cursor: "pointer", fontSize: "12px" };
const nav     = { display: "flex", justifyContent: "space-around", padding: "8px", background: "#020617", borderTop: "1px solid #334155" };
const navItem = { cursor: "pointer", textAlign: "center", flex: 1, padding: "6px", transition: "0.2s" };

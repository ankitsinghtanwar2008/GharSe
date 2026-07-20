import { useState, useEffect } from "react";

// =============================================
// 🔧 SIRF YAHAN APNA IMAGE URL PASTE KAREIN
// =============================================
const MASCOT_IMAGE_URL = "/chatbotLogoWithoutbg.png";
// =============================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&display=swap');

  @keyframes floatBob {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50%       { transform: translateY(-10px) rotate(2deg); }
  }

  @keyframes ripple {
    0%   { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  @keyframes bubblePop {
    0%   { transform: scale(0) translateY(10px); opacity: 0; }
    60%  { transform: scale(1.08) translateY(-2px); opacity: 1; }
    80%  { transform: scale(0.96) translateY(0px); }
    100% { transform: scale(1) translateY(0px); opacity: 1; }
  }

  @keyframes bubbleFade {
    0%   { transform: scale(1) translateY(0px); opacity: 1; }
    100% { transform: scale(0.85) translateY(6px); opacity: 0; }
  }

  @keyframes dotBlink {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
    40%           { opacity: 1;   transform: scale(1.2); }
  }

  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(30, 47, 110, 0.35), 0 8px 32px rgba(30,47,110,0.25); }
    50%      { box-shadow: 0 0 0 14px rgba(30, 47, 110, 0), 0 8px 32px rgba(30,47,110,0.25); }
  }

  @keyframes badgePing {
    0%   { transform: scale(1); opacity: 1; }
    70%  { transform: scale(1.8); opacity: 0; }
    100% { transform: scale(1.8); opacity: 0; }
  }

  .gharse-fab-wrap {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    font-family: 'Nunito', sans-serif;
  }

  .gharse-bubble {
    background: #1E2F6E;
    color: #fff;
    padding: 11px 16px;
    border-radius: 18px 18px 4px 18px;
    font-size: 13.5px;
    font-weight: 700;
    white-space: nowrap;
    letter-spacing: 0.01em;
    position: relative;
    line-height: 1.4;
    max-width: 220px;
  }

  .gharse-bubble.show {
    animation: bubblePop 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }

  .gharse-bubble.hide {
    animation: bubbleFade 0.25s ease-in forwards;
  }

  .gharse-bubble-sub {
    font-size: 11px;
    font-weight: 600;
    opacity: 0.75;
    margin-top: 2px;
  }

  .gharse-bubble-dots {
    display: inline-flex;
    gap: 4px;
    margin-top: 6px;
  }

  .gharse-bubble-dots span {
    width: 7px;
    height: 7px;
    background: rgba(255,255,255,0.7);
    border-radius: 50%;
    display: inline-block;
    animation: dotBlink 1.4s ease-in-out infinite;
  }

  .gharse-bubble-dots span:nth-child(2) { animation-delay: 0.2s; }
  .gharse-bubble-dots span:nth-child(3) { animation-delay: 0.4s; }

  .gharse-fab-btn {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: #fff;
    padding: 0;
    position: relative;
    animation: floatBob 3.2s ease-in-out infinite, glowPulse 2.5s ease-in-out infinite;
    transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .gharse-fab-btn:hover {
    transform: scale(1.13) translateY(-4px) !important;
    animation: glowPulse 2.5s ease-in-out infinite;
  }

  .gharse-fab-btn:active {
    transform: scale(0.94) !important;
  }

  .gharse-fab-btn img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
    display: block;
  }

  .gharse-ripple {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(30, 47, 110, 0.18);
    animation: ripple 2s ease-out infinite;
    pointer-events: none;
  }

  .gharse-ripple:nth-child(2) { animation-delay: 0.7s; }

  .gharse-badge {
    position: absolute;
    top: -3px;
    right: -3px;
    width: 18px;
    height: 18px;
    background: #E83030;
    border-radius: 50%;
    border: 2.5px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 800;
    color: #fff;
    font-family: 'Nunito', sans-serif;
  }

  .gharse-badge::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: #E83030;
    animation: badgePing 1.5s ease-out infinite;
    z-index: -1;
  }
`;

export default function ChatbotButton({ onOpen }) {
  const [open, setOpen] = useState(false);
  const [bubbleState, setBubbleState] = useState("show"); // "show" | "hide" | "hidden"
  const [showDots, setShowDots] = useState(false);

  // Auto-show bubble after 1.5s, then typing dots after 2.5s
  useEffect(() => {
    const t1 = setTimeout(() => setBubbleState("show"), 1500);
    const t2 = setTimeout(() => setShowDots(true), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleClick = () => {
    if (bubbleState === "show") {
      setBubbleState("hide");
      setTimeout(() => setBubbleState("hidden"), 260);
    }
    setOpen(!open);
    if (onOpen) onOpen(!open);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="gharse-fab-wrap">

        {/* Speech Bubble */}
        {bubbleState !== "hidden" && (
          <div className={`gharse-bubble ${bubbleState}`}>
            <div>Help is here: <strong>GharSe</strong> 🏠</div>
            <div className="gharse-bubble-sub">Kuch puchna hai? Main yahan hoon!</div>
            {showDots && (
              <div className="gharse-bubble-dots">
                <span/><span/><span/>
              </div>
            )}
          </div>
        )}

        {/* Floating Button */}
        <button
          className="gharse-fab-btn"
          onClick={handleClick}
          aria-label="Open GharSe Chat"
          title="Chat with Ask Udai"
        >
          {/* Ripple rings */}
          <span className="gharse-ripple" />
          <span className="gharse-ripple" />

          {/* Mascot Image */}
          <img
            src={MASCOT_IMAGE_URL}
            alt="Ask Udai - GharSe Chatbot"
          />

          {/* Notification badge */}
          <span className="gharse-badge">1</span>
        </button>
      </div>
    </>
  );
}

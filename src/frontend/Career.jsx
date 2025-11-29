import { useState } from "react";
import axios from "axios";
import "./Career.css";

function Career() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleReply = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("${API}/api/interview", {
        message: input,
      });

      const aiReply = { role: "assistant", content: res.data.reply };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error("Error:", err);
      const errorMsg = { role: "assistant", content: "❌ Something went wrong. Try again later." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleReply();
  };

  return (
    <div className="career-chat">
      <h1>Career Chat</h1>
      <p className="subtitle">Clear your path</p>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <p key={index} className={msg.role}>
            <b>{msg.role}:</b> {msg.content}
          </p>
        ))}

        {loading && <p className="loading">⏳ AI is thinking...</p>}
      </div>

      <input
        type="text"
        placeholder="Ask your career doubts"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <button onClick={handleReply} disabled={loading}>
        Send
      </button>
    </div>
  );
}

export default Career;

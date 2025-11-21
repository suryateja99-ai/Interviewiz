import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./CodeExplain.css";

function CodeExplain() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMsg = async () => {
    if (!input.trim()) return;

    const newMessage = [...messages, { role: "user", content: input }];
    setMessages(newMessage);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/code-explainer", {
        message: input,
      });

      const aiReply = { role: "assistant", content: res.data.reply };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.log("Error occurred:", err);
    } finally {
      setLoading(false);
    }

    
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleReply();
  };
  return (
    <div className="codeexp">
      <h2 className="title">Code Tutor</h2>
      <p className="subtitle">Crack the code 🔍</p>

      <div className="chat-section">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "user" ? "user-msg" : "ai-msg"}
          >
            <b>{msg.role === "user" ? "You" : "AI"}:</b>
            <div className="markdown">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {msg.content}
  </ReactMarkdown>
</div>
          </div>
        ))}

        {loading && <p className="loading">⏳ Thinking...</p>}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Ask to explain your code..."
          onChange={(e) => setInput(e.target.value)} 
          className="input-box"

          handleKeyDown={handleKeyDown}
        />
        <button onClick={handleMsg} className="submit">
          Ask
        </button>
      </div>
    </div>
  );
}

export default CodeExplain;

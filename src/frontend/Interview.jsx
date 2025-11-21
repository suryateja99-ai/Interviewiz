import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MonacoEditor from "@monaco-editor/react";
import "./Interview.css";

function Interview() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hello! Let’s start the interview. Introduce yourself." },
  ]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("voice"); // "voice", "code", "none"
  const [code, setCode] = useState("// Write your code here...");
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);

  const [userSpeaking, setUserSpeaking] = useState(false);

  
  const cleanAIReply = (text) => text?.replace(/<think>.*?<\/think>/gis, "").trim();

  // ---------------- Voice Functions ----------------
  const speak = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onstart = () => document.body.classList.add("ai-speaking");
    utterance.onend = () => {
      document.body.classList.remove("ai-speaking");
      if (mode === "voice") startListening();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setUserSpeaking(true);
    recognition.onend = () => setUserSpeaking(false);

    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      sendMessage(speech);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setUserSpeaking(false);
    }
  };

  // ---------------- Send Message ----------------
  const sendMessage = async (userInput) => {
    if (!userInput?.trim()) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (!res.ok || !data.reply) throw new Error("AI did not respond");

      const replyClean = cleanAIReply(data.reply);
      const aiMessage = { role: "assistant", content: replyClean };
      setMessages([...newMessages, aiMessage]);

      // End of interview detection
      const endKeywords = [
        "interview completed",
        "thank you for participating",
        "goodbye",
      ];
      const isEnd = endKeywords.some((kw) =>
        replyClean.toLowerCase().includes(kw)
      );

      if (isEnd) {
        setMode("none");
        stopListening();

        // Ask AI to calculate marks
        const scoreMsg = "Please evaluate user answers brutally and give marks out of 100.";
        const finalMessage = [...newMessages, aiMessage, { role: "user", content: scoreMsg }];

        setTimeout(() => sendMessage(scoreMsg), 1000);
        return;
      }

      // Detect coding question
      const codeKeywords = ["write a function", "implement", "code"];
      const isCode = codeKeywords.some((kw) =>
        replyClean.toLowerCase().includes(kw)
      );

      if (isCode) {
        setMode("code");
        speak("Please write the code in the editor and submit.");
      } else {
        setMode("voice");
        speak(replyClean);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "❌ Server error. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Submit Code ----------------
  const submitCode = () => {
    if (!code.trim()) return;
    const codeMessage = `Here is my code:\n${code}`;
    sendMessage(codeMessage);
    setCode("// Write your code here...");
    setMode("voice");
  };

  useEffect(() => {
    if (mode === "voice") startListening();
    return () => stopListening();
  }, []);

  // ---------------- UI ----------------
  return (
    <div className="interview-container">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="interview-title"
      >
        🧠 AI Hybrid Interviewer
      </motion.h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`message ${msg.role}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {msg.content}
          </motion.div>
        ))}

        <AnimatePresence>
          {loading && (
            <motion.div
              className="typing-indicator"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <div className="jelly-ball"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="input-area">
        {mode === "voice" && (
          <motion.div className={`voice-only ${userSpeaking ? "user-speaking" : ""}`}>
            <p>🎤 Listening... Please speak your answer.</p>
          </motion.div>
        )}

        {mode === "code" && (
          <>
            <MonacoEditor
              height="300px"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={setCode}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={submitCode}
            >
              Submit Code
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}

export default Interview;

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Body.css";

function Body() {
  const navigate = useNavigate();

  return (
    <div className="body-container">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="main-title"
      >
        Welcome to <span>IntervieWiz</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="intro-text"
      >
        Transform your preparation into real interview experiences.  
        Our AI simulates interview rounds, analyzes your responses,  
        and helps you grow — step by step, question by question.
      </motion.p>

      <motion.div
        className="process-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} className="process-card">
          <h3>1️⃣ Choose Your Role</h3>
          <p>Select your target job (Frontend, QA, Backend, etc.)</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="process-card">
          <h3>2️⃣ AI Conducts Interview</h3>
          <p>Answer AI-generated technical and HR questions in real time.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="process-card">
          <h3>3️⃣ Get Instant Feedback</h3>
          <p>Receive evaluation, improvement tips, and confidence score.</p>
        </motion.div>
      </motion.div>

      <motion.button
        className="start-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/interview")}
      >
        🚀 Start Interview Practice
      </motion.button>
    </div>
  );
}

export default Body;

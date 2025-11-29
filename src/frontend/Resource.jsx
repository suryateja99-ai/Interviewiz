import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Resource.css";

function Resources() {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAiResponse(null);

    try {
      const response = await fetch("${API}/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();
      setAiResponse(data);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const defaultResources = [
    {
      title: "Develop Effective Communication Skills",
      summary:
        "A step-by-step guide to becoming clear, confident, and impactful in your communication.",
      link: "https://www.coursera.org/learn/communication-skills",
    },
    {
      title: "Be Cool and Confident During Interviews",
      summary:
        "Learn mindset tricks, body language tips, and strategies to handle tough interview moments.",
      link: "https://www.linkedin.com/learning/interviewing-techniques",
    },
    {
      title: "Learn & Write Code Easily and Fast",
      summary:
        "A collection of interactive coding platforms and AI-assisted learning tools to speed up your skills.",
      link: "https://www.freecodecamp.org/",
    },
  ];

  return (
    <div className="resources-container">
      <div className="resources-header">
        <h2>Resources</h2>
        <form onSubmit={handleSubmit} className="resources-search">
          <input
            type="text"
            placeholder="Ask AI for a resource..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="resources-body">
        {loading ? (
          <motion.div
            className="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⏳ Finding best resources for you...
          </motion.div>
        ) : aiResponse ? (
          <motion.div
            className="ai-resource-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>{aiResponse.title}</h3>
            <p>{aiResponse.summary}</p>
            <a href={aiResponse.link} target="_blank" rel="noreferrer">
              Visit Resource ↗
            </a>
          </motion.div>
        ) : (
          <div className="default-resources">
            {defaultResources.map((res, i) => (
              <motion.div
                key={i}
                className="resource-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3>{res.title}</h3>
                <p>{res.summary}</p>
                <a href={res.link} target="_blank" rel="noreferrer">
                  Visit Resource ↗
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Resources;

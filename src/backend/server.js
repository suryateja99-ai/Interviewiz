import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- Interview Route ----------------
app.post("/api/interview", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid message format" });
    }

    console.log("✅ Interview messages received:", messages);

    const bodyData = {
      model: "DeepSeek-V3-0324",
      messages: [
        {
          role: "system",
          content: `
You are an AI interviewer conducting a realistic mock interview.
Rules:
1. Ask one question at a time.
2. After the user answers, evaluate briefly (2–3 lines), then ask the next question.
3. Keep tone professional, adaptive, and friendly.
4. Tailor questions based on user’s background if mentioned.
5. Avoid markdown like ### or ** — keep responses clean for chat UI.
`
        },
        ...messages,
      ],
      temperature: 0.1,
      top_p: 0.1,
    };

    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SAMBANOVA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    if (!response.ok || !data?.choices?.[0]?.message?.content) {
      console.error("❌ Interview AI error:", data);
      return res.status(500).json({ error: "AI did not respond", details: data });
    }

    const reply = data.choices[0].message.content;
    console.log("✅ AI Interview reply:", reply);

    res.json({ reply });
  } catch (err) {
    console.error("💥 Interview server error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// ---------------- Career Chat Route ----------------
app.post("/api/career-chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    console.log("✅ Career message received:", message);

    const bodyData = {
      model: "DeepSeek-V3-0324",
      messages: [
        {
          role: "system",
          content: "You are a professional career advisor AI. Give short, clear, and professional advice based on user input. Remember every reply of user and maintain the continuation."
        },
        { role: "user", content: message },
      ],
      temperature: 0.2,
      top_p: 0.2,
    };

    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SAMBANOVA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    if (!response.ok || !data?.choices?.[0]?.message?.content) {
      console.error("❌ Career AI error:", data);
      return res.status(500).json({ error: "Career AI did not respond", details: data });
    }

    const aiReply = data.choices[0].message.content;
    console.log("✅ Career AI reply:", aiReply);

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("💥 Career server error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

///--------------- Code Explainer -----------------
app.post('/api/code-explainer', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const bodyData = {
      model: "DeepSeek-V3-0324",
      messages: [
        {
          role: "system",
          content:
            `
You are a **professional AI coding tutor**.
Your job is to explain any code clearly using this structure:
- Use **bold titles** for each step.
- Use **numbered or bulleted lists** for clarity.
- Wrap any code inside proper markdown code blocks (like \`\`\`js ... \`\`\`).
- Make it look clean, readable, and beginner-friendly.
Never include system or debug thoughts — only show the formatted explanation.`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.2,
      top_p: 0.2,
    };

    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SAMBANOVA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    if (!data?.choices?.[0]?.message?.content) {
      console.error("❌ Code Explainer AI error:", data);
      return res.status(500).json({
        error: "AI did not respond properly",
        details: data,
      });
    }

    const aiReply = data.choices[0].message.content;
    console.log("✅ Code Explainer AI reply:", aiReply);

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("❌ Error in /api/code-explainer route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ------------------ Resources AI ------------------
app.post("/api/resources", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const bodyData = {
      model: "DeepSeek-V3-0324",
      messages: [
        {
          role: "system",
          content:
            "You are an AI learning resource recommender. The user will ask for a learning resource or self-improvement topic. Reply strictly in JSON format with three keys: 'title', 'summary', and 'link'.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.4,
      top_p: 0.9,
    };

    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SAMBANOVA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      console.error("❌ No AI response:", data);
      return res.status(500).json({ error: "No AI reply" });
    }

    // Sometimes the model sends code block format — remove ```json etc.
    const clean = content
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    let aiObj;
    try {
      aiObj = JSON.parse(clean);
    } catch (err) {
      aiObj = {
        title: "Resource Recommendation",
        summary: content,
        link: "#",
      };
    }

    res.json(aiObj);
  } catch (err) {
    console.error("❌ Resource route error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public")); // serves index.html, style.css, main.js

// ============================================================
//  PICK YOUR PROVIDER HERE  ->  "groq" | "gemini"
// ============================================================
const PROVIDER = "groq";

// Models for each provider (change if you like)
const MODELS = {
  groq: "llama-3.3-70b-versatile",     // see console.groq.com/docs/models
  gemini: "gemini-2.5-flash",          // see aistudio.google.com
};

// ---- Each provider returns a normalized { reply } ----------

async function callGroq(userMessage) {
  // Groq is OpenAI-compatible. Free key at console.groq.com
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODELS.groq,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content.trim();
}

async function callGemini(userMessage) {
  // Gemini has its own request/response shape. Free key at aistudio.google.com
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.gemini}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userMessage }] }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates[0].content.parts[0].text.trim();
}

const PROVIDERS = {
  groq: callGroq,
  gemini: callGemini,
};

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "No message provided" });
  }

  const handler = PROVIDERS[PROVIDER];
  if (!handler) {
    return res.status(500).json({ error: `Unknown PROVIDER: "${PROVIDER}"` });
  }

  try {
    const reply = await handler(userMessage);
    res.json({ reply });
  } catch (err) {
    console.error(`[${PROVIDER}] error:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}  (provider: ${PROVIDER})`)
);
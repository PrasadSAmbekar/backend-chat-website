const express = require('express');
const axios = require('axios');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());

app.post('/generate-text', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ response: text || 'No response generated' });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.listen(PORT, () => console.log("3000"));

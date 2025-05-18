const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

app.post("/api/submit-idea", async (req, res) => {
  const data = req.body;

  const prompt = `
You are a startup critique assistant. A user has submitted a business or invention idea.

1. Idea Summary  
2. Market Analysis  
3. Competitor Snapshot  
4. Trademark Search (simulate based on name similarity)  
5. Legal/Regulatory Considerations  
6. Technical Feasibility  
7. Suggested Improvements  
8. Overall Critique Score (1–10)

*This is not legal advice. For a full trademark search, consult an attorney.*

---
Name: ${data.idea_name}
Description: ${data.idea_description}
Problem Solved: ${data.problem_solved}
Target Customer: ${data.target_customer}
Competitors: ${data.competitors}
Category: ${data.category}
Brand Name(s): ${data.brand_names}
---`;

  try {
    const chat = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ message: chat.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

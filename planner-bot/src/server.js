import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/schedule", async (req, res) => {
  const tasks = req.body.tasks;
  if (!tasks) return res.status(400).send("No tasks provided");

  const prompt = `I have the following tasks:\n${tasks.join("\n")}\n
Please create a schedule for these tasks today, estimating time for each task in minutes. Return as JSON array of objects with "task" and "time".`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const response = completion.choices[0].message.content;
    res.json({ schedule: response });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating schedule");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

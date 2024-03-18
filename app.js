const express = require("express");
const cors = require("cors");
const speechToText = require("./models/SpeechToText");

const logRoutes = require("./middleware/logger");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logRoutes);
app.use(bodyParser.raw({ type: "audio/*", limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    name: "Language app",
    description: "An app that utilizes AI to help teach languages",
  });
});

app.post("/receive", async (req, res) => {
  try {
    const audioData = req.body.audio;
    const transcription = await speechToText(audioData);
    console.log("Transcription:", transcription);

    const reply = await callOpenAI(transcription);
    console.log("AI reply:", reply);

    await textToSpeech(reply);

    res.send("Audio generated successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing audio");
  }
});

app.get("/send", (req, res) => {
  res.set("Content-Type", "audio/mp3");
  const audioStream = fs.createReadStream(speechFile);
  audioStream.pipe(res);
});

module.exports = app;

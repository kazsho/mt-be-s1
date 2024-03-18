const express = require("express");
const cors = require("cors");

const logRoutes = require("./middleware/logger");
const bodyParser = require("body-parser");
const audioController = require("./controllers/controller");

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

app.post("/receive", audioController.receive);

app.get("/send", (req, res) => {
  res.set("Content-Type", "audio/mp3");
  const audioStream = fs.createReadStream(speechFile);
  audioStream.pipe(res);
});

module.exports = app;

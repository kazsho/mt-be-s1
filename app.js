const express = require("express");
const cors = require("cors");
const conversationArray = require("./Services/PromptAI");
const multer = require("multer");

const fs = require("fs");
const path = require("path");

const logRoutes = require("./middleware/logger");
const bodyParser = require("body-parser");
const audioController = require("./controllers/controller");

const speechFolderPath = path.resolve("./speechFile");

if (!fs.existsSync(speechFolderPath)) {
  fs.mkdirSync(speechFolderPath);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logRoutes);
app.use(bodyParser.raw({ type: "audio/*", limit: "10mb" }));

// Routes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // File naming convention
  },
});

// Initialize multer middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size (optional)
});

// Routes
app.get("/", (req, res) => {
  res.json({
    name: "Language app",
    description: "An app that utilizes AI to help teach languages",
  });
});

// Route to receive user's recorded speech audio 
app.post("/receive", upload.single("audio"), audioController.receive);

//conversation array from ai
app.get("/conversation", async (req, res) => {
  res.json(conversationArray);
});

(module.exports = app), speechFolderPath; 

const speechToText = require("./models/SpeechToText");
const fs = require("fs");
const path = require("path");

async function receive(req, res) {
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
}

async function send(req, res) {
  try {
    const files = await fs.promises.readdir(speechFolderPath);

    if (!files || files.length === 0) {
      return res.status(404).send("No audio files found");
    }

    const filePaths = files.map((file) => path.join(speechFolderPath, file));
    const fileStatsPromises = filePaths.map((filePath) =>
      fs.promises.stat(filePath)
    );
    const fileStats = await Promise.all(fileStatsPromises);

    const sortedFiles = files
      .map((file, index) => ({ file, mtime: fileStats[index].mtime.getTime() }))
      .sort((a, b) => b.mtime - a.mtime);

    const latestAudioFile = sortedFiles[0].file;
    const audioFilePath = path.join(speechFolderPath, latestAudioFile);

    res.sendFile(audioFilePath);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { receive, send };

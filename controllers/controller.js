const transcribeGujarati = require("../Services/SpeechToText");

const fs = require("fs").promises;
const path = require("path");
const { callOpenAIWithTranscription } = require("../Services/PromptAI");
const textToSpeech = require("../Services/TextToSpeech");
const speechFolderPath = require("../app");

async function receive(req, res) {
  // Handle errors on the data coming in
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    // Receive audio asynchronously
    const audioData = await fs.readFile(
      path.join(__dirname, "..", req.file.path)
    );

    // Call the speech to text asynchronously
    const transcription = await transcribeGujarati(audioData);

    // Ask for GPT reply asynchronously
    const reply = await callOpenAIWithTranscription(transcription);

    // Generate speech file asynchronously
    await textToSpeech(reply);

    // Find folder speech file
    const speechFilePath = path.join(speechFolderPath, "speech.mp3");
    const audioFile = await fs.readFile(speechFilePath);

    // Set response to indicate an audio
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "attachment; filename=speech.mp3",
    });

    // Send the audio to frontend
    res.write(audioFile);

    // Send the transcription back too
    res.write("\nTranscription:\n" + transcription);

    // End response
    // Send both in the same request to ensure no further processing
    res.end();
  } catch (error) {
    // Error handling
    console.error("Error while transcribing:", error);
    res.status(500).json({ error: "server error" });
  }
}

module.exports = { receive };

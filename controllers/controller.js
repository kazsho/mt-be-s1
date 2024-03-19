const {
  transcribeGujarati,
  transcribeEnglish,
} = require("../Services/SpeechToText");

const fs = require("fs").promises;
const path = require("path");
const { callOpenAIWithTranscription } = require("../Services/PromptAI");
const { textToSpeech } = require("../Services/TextToSpeech");
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

    // // Call Google Cloud Speech-to-Text APIs
    const gujaratiTranscription = await transcribeGujarati(audioData);
    const englishTranscription = await transcribeEnglish(audioData);

    // // Ask for GPT reply asynchronously
    // const textReplyFromGPT = await callOpenAIWithTranscription(
    //   gujaratiTranscription,
    //   englishTranscription
    // );

    // Mock GPT reply for debugging
    const textReplyFromGPT = "This is a mock reply from GPT";

    // Generate text-to-speech audio from the language model
    const speechReplyFromGPT = await textToSpeech(textReplyFromGPT);
    const base64speechReplyFromGPT = speechReplyFromGPT.toString("base64");

    // // Find folder speech file
    // const speechFilePath = path.join(speechFolderPath, "speech.mp3");
    // const audioFile = await fs.readFile(speechFilePath);

    res.status(200).json({
      // userAudio: req.file, // (The original request audio)
      modelAudio: base64speechReplyFromGPT,
      userTranscription: englishTranscription,
      modelTranscription: textReplyFromGPT,
    });
  } catch (error) {
    console.error("Error while transcribing:", error);
    res.status(500).json({ error: "server error" });
  }
}

module.exports = { receive };

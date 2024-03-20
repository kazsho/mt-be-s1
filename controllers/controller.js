const { transcribeGujarati, transcribeEnglish } = require("../Services/SpeechToText");
const { callOpenAIWithTranscription } = require("../Services/PromptAI");
const { textToSpeech } = require("../Services/TextToSpeech");

// const path = require("path");
// const fs = require("fs").promises;
// const speechFolderPath = require("../app");

async function receive(req, res) {
  // Handle errors on the data coming in
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    // This binary audio data can be saved to a database at this point. 
    // No need to save to disk!
    const userAudioData = req.file.buffer;

    // // Call Google Cloud Speech-to-Text APIs
    const gujaratiTranscription = await transcribeGujarati(userAudioData);
    const englishTranscription = await transcribeEnglish(userAudioData);

    // // Ask for GPT reply asynchronously
    // const textReplyFromGPT = await callOpenAIWithTranscription(
    //   gujaratiTranscription,
    //   englishTranscription
    // );

    // Mock GPT reply for debugging
    const textReplyFromGPT = "This is a mock reply from GPT";

    // Generate text-to-speech audio from the language model
    const speechReplyFromGPT = await textToSpeech(textReplyFromGPT);

    // // Find folder speech file
    // const speechFilePath = path.join(speechFolderPath, "speech.mp3");
    // const audioFile = await fs.readFile(speechFilePath);

    res.status(200).json({
      userAudio: userAudioData.toString('base64'), // (The original request audio)
      modelAudio: speechReplyFromGPT.toString('base64'),
      userTranscription: englishTranscription,
      modelTranscription: textReplyFromGPT,
    });
  } catch (error) {
    console.error("Error while transcribing:", error);
    res.status(500).json({ error: "server error" });
  }
}

module.exports = { receive };

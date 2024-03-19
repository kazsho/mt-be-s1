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
    // // Receive audio asynchronously
    const audioData = await fs.readFile(
      path.join(__dirname, "..", req.file.path)
    );

    // // Call the speech to text asynchronously
    const gujaratiTranscription = await transcribeGujarati(audioData);
    const englishTranscription = await transcribeEnglish(audioData);

    // // Ask for GPT reply asynchronously
    const textReplyFromGPT = await callOpenAIWithTranscription(
      gujaratiTranscription,
      englishTranscription
    );

    // // Generate speech file asynchronously
    const speechReplyFromGPT = await textToSpeech(textReplyFromGPT);

    // // Find folder speech file
    // const speechFilePath = path.join(speechFolderPath, "speech.mp3");
    // const audioFile = await fs.readFile(speechFilePath);

    // // Set response to indicate an audio
    res.set({
      "Content-Type": "audio/*",
      "Content-Disposition": "attachment; filename=speech.mp3",
    });

    // // Send the audio to frontend
    // res.write(audioFile);

    // // Send the transcription back too
    // res.write("\nTranscription:\n" + transcription);

    console.log("speechReplyFromGPT", speechReplyFromGPT);

    // Our lovely response object
    const responseObject = {
      userAudio: req.file, // The original request audio
      modelAudio: speechReplyFromGPT,
      userTranscription: englishTranscription,
      modelTranscription: textReplyFromGPT,
    };

    res.status(200).send(responseObject);

    // End response
    // Send both in the same request to ensure no further processing
    // res.end();
  } catch (error) {
    // Error handling
    console.error("Error while transcribing:", error);
    res.status(500).json({ error: "server error" });
  }
}

module.exports = { receive };

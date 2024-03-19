const transcribeGujarati = require("../Services/SpeechToText");
const fs = require("fs");
const path = require("path");
const { callOpenAIWithTranscription } = require("../Services/PromptAI");
const textToSpeech = require("../Services/TextToSpeech");
const speechFolderPath = require("../app");

async function receive(req, res) {
  //handle errors on the data coming in
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    //receive audio
    const audioData = fs.readFileSync(
      path.join(__dirname, "..", req.file.path)
    );

    //i call the speech to text
    const transcription = await transcribeGujarati(audioData);

    // ask for GPT reply
    const reply = await callOpenAIWithTranscription(transcription);

    // Generate speech file
    await textToSpeech(reply);

    // find folder speech file
    const speechFilePath = path.join(speechFolderPath, "speech.mp3");
    const audioFile = fs.readFileSync(speechFilePath);

    // Set response indicate  an audio
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "attachment; filename=speech.mp3",
    });

    // Send the audio to frontend
    res.write(audioFile);

    //send the transcription back too
    res.write("\nTranscription:\n" + transcription);

    //end response
    //send both in the same request to ensure no further processing
    res.end();
  } catch (error) {
    //error handling
    console.error("Error while transcribing:", error);
    res.status(500).json({ error: "server error" });
  }
}

module.exports = { receive };

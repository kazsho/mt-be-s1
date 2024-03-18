const speechToText = require("./models/SpeechToText");

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

module.exports = { receive };

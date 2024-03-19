const speech = require("@google-cloud/speech");

const client = new speech.SpeechClient({
  keyFilename: "./key.json",
});

async function speechToText(audioData) {
  try {
    const audioBytes = Buffer.from(audioData, "base64");

    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: "FLAC",
      sampleRateHertz: 48000,
      languageCode: "gu-IN",
      audioChannelCount: 1,
      enableSeparateRecognitionPerChannel: false,
    };
    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    return transcription;
  } catch (error) {
    console.error("ERROR:", error);
    throw error;
  }
}

module.exports = { speechToText };

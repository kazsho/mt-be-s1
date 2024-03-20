const speech = require("@google-cloud/speech");

const client = new speech.SpeechClient({
  keyFilename: "./key.json",
});

async function speechToText(audioData, languageCode) {
  try {
    const audioBytes = Buffer.from(audioData, "base64");

    const audio = {
      content: audioBytes,
    };
    const config = {
      // encoding: "FLAC",
      // sampleRateHertz: 48000,
      languageCode: languageCode,
      // audioChannelCount: 1,
      // enableSeparateRecognitionPerChannel: false,
    };
    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await client.recognize(request);
    const transcripts = response.results.map(
      (result) => result.alternatives[0].transcript
    );
    console.log(transcripts);
    return transcripts;
  } catch (error) {
    console.error("ERROR:", error);
    throw error;
  }
}
function transcribeGujarati(audioData) {
  return speechToText(audioData, "gu-IN");
}

function transcribeEnglish(audioData) {
  return speechToText(audioData, "en-GB");
}

module.exports = {
  transcribeGujarati,
  transcribeEnglish,
};

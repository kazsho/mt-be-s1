const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const speechFolderPath = path.resolve("./speechFile");

if (!fs.existsSync(speechFolderPath)) {
  fs.mkdirSync(speechFolderPath);
}

async function textToSpeech(text) {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());

    const speechFilePath = path.join(speechFolderPath, "speech.mp3");

    await fs.promises.writeFile(speechFilePath, buffer);
    console.log("Speech file saved to:", speechFilePath);
  } catch (error) {
    console.error("ERROR:", error);
    throw error;
  }
}
module.exports = textToSpeech;

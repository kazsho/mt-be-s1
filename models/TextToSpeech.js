const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const speechFile = path.resolve("./speech.mp3");

async function textToSpeech(text) {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    console.log("Speech file saved to:", speechFile);
  } catch (error) {
    console.error("ERROR:", error);
    throw error;
  }
}
module.exports = textToSpeech;

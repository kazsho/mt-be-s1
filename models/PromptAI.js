const OpenAI = require("openai");
require("dotenv").config();
const readline = require("readline");
const speechToText = require("./SpeechToText");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const conversationArray = [
  {
    role: "system",
    content:
      "You are a helpful language tutor. Your job is to help the user learn Gujarati...",
  },
];
async function callOpenAI(userInput) {
  conversationArray.push({
    role: "user",
    content: userInput,
  });
  const chatCompletion = await openai.chat.completions.create({
    messages: conversationArray,
    model: "gpt-3.5-turbo",
    max_tokens: 150,
    temperature: 1,
  });
  const reply = chatCompletion.choices[0].message.content;
  conversationArray.push({
    role: "assistant",
    content: reply,
  });
  return reply;
}

(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  async function chat() {
    rl.question("You: ", async (userInput) => {
      try {
        const transcription = await speechToText(userInput);

        const reply = await callOpenAI(transcription);
        console.log("AI: ", reply);
      } catch (error) {
        console.error("Error:", error);
      }

      chat();
    });
  }

  chat();
})();

module.exports = { callOpenAI }

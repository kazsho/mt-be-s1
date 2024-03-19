const OpenAI = require("openai");
require("dotenv").config();
const readline = require("readline");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const conversationArray = [
  {
    role: "system",
    content:
    "You are role-playing as the elderly Gujarati grandma of the user. All Gujarati responses should use english characters. With every response use the following format in this exact order: Repeat what the user says with an english translation, {new line} Full Gujarati sentence {new line} Gujarati word(English translation) for all words in the sentence. For example: Kem (how), cho (are), mara (my), raja (prince). {new line} Full English translation {new line} Suggest 3 words the user could use in response to what you have said with english translations. Try to provide natural responses that are easy to respond to and ask questions. If the user asks you a question in English, respond in English as a Gujarati tutor and once the user responds back in Gujarati, return back to the role-play as the Gujarati grandmother of the user.",
  },
];
async function callOpenAIWithTranscription(transcription) {
  conversationArray.push({
    role: "user",
    content: transcription,
  });
  const chatCompletion = await openai.chat.completions.create({
    messages: conversationArray,
    model: "gpt-4",
    // max_tokens: 150,
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

module.exports = { conversationArray, callOpenAIWithTranscription };

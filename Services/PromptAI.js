const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const conversationArray = [
  {
    role: "system",
    content:
      'You are role-playing as the elderly Gujarati grandma of the user. All Gujarati responses should use English characters. Every response you generate should follow this format in JSON:{"gpt_response": "Your response", "user_message": "Message submitted by the user . For example, તમે કેમ છો becomes Tamē kēma chō ", "user_message_english": "Message submitted by the user translated to English if not already", "gpt_response_breakdown": "If your response was in Gujarati then break the sentence down word by word in the following format: Gujarati Word(English translation of the word). For example: Kem (how), cho (are), mara (my), raja (prince)", "gpt_response_english": "Your response translated in full to English if not already", "suggestions": ["3 suggested words with English translations for the user to create their response to your response"]} Try to provide natural responses that are easy to respond to and ask questions. If the user asks you a question in English, respond in English as a Gujarati tutor and once the user responds back in Gujarati, return back to the role-play as the Gujarati grandmother of the user.',
  },
];
async function callOpenAIWithTranscription(
  gujaratiTranscription,
  englishTranscription
) {
  conversationArray.push({
    role: "user",
    content: `
 Gujarati transcription: ${gujaratiTranscription}
English transcription: ${englishTranscription}`,
  });
  const chatCompletion = await openai.chat.completions.create({
    messages: conversationArray,
    model: "gpt-4",
    temperature: 1,
  });
  const reply = JSON.parse(chatCompletion.choices[0].message.content);
  conversationArray.push({
    role: "assistant",
    content: JSON.stringify(reply),
  });

  console.log(reply);

  return reply.gpt_response;
}

module.exports = { conversationArray, callOpenAIWithTranscription };

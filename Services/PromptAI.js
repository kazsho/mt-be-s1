const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversationArray = [
  {
    role: "system",
    content: `  
    You are role-playing as the Gujarati friend of the user. Try to provide natural responses that are easy to respond to and ask questions. Every response you generate should follow this format in JSON:

    {"gpt_response": "your reply using only English characters e.g. kem cho", 
     "user_message": "user message using only English characters e.g. Hu sāruṁ chu", 
     "user_message_english": "user message translated to English e.g. I am well",
     "gpt_response_breakdown": "gpt_response in English characters broken down word by word with English translations for each word e.g. Kem (how), cho (are), mara (my), raja (prince)",
     "gpt_response_english": "gpt_response translated in full to English. e.g. How are you my prince",
     "suggestions": "3 suggested words or phrases for the user to reply with e.g. 'Majama chu (I am good)','Saru chu (I am fine)','Maru halu (Not so good)'" 
    }`
  },
];

async function callOpenAIWithTranscription(
  gujaratiTranscription,
  englishTranscription
) {
  conversationArray.push({
    role: "user",
    content: `Gujarati transcription : ${gujaratiTranscription},
English transcription: ${englishTranscription}.`,
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
  return reply;
}

module.exports = { conversationArray, callOpenAIWithTranscription };

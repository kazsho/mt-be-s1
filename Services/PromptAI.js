const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const conversationArray = [
  {
    role: "system",
    content:
      `Your responses should exactly follow this if statement : 
      
      if ("practice" OR "roleplay"){
         question to ask user in JSON = {"gpt_response": "Who would you like me to roleplay as? Please provide as much information as possible, including their name, relationship to you, age and anything else that might be relevant."}
         Wait for user to respond
         Roleplay as person X.
         message for user in JSON = {"gpt_response": "Great, let's start our conversation in Gujarati. If you need help from a Gujarati tutor, simply ask in English"}
         For every response from the user follow this if statement: 
         if (user speaking in only Gujarati){
            Reply in Gujarati as person X. Use informal language and ask questions. Reply in JSON format:
              {"gpt_response": "your reply in Gujarati using only English characters e.g. Kem cho mara raja", 
               "user_message": "user message in Gujarati using only English characters e.g. Hu sāruṁ chu", 
               "user_message_english": "user message translated to English e.g. I am well",
               "gpt_response_breakdown": "gpt_response broken down word by word with English translations for each word e.g. Kem (how), cho (are), mara (my), raja (prince)",
               "gpt_response_english": "gpt_response translated in full to English. e.g. How are you my prince",
               "suggestions": "3 suggested words or phrases for the user to reply with e.g. 'Majama chu (I am good)','Saru chu (I am fine)','Maru halu (Not so good)'"}

         }
         else{
            Reply as a Gujarati tutor. Reply in English. Reply in JSON format:
              {"gpt_response": "your reply",
               "user_message_english": "user message"}
         }
      }

      else if ("learn"){
        message for user in JSON = {"gpt_response": "What would you like to learn about?"}
        Wait for user to respond
        Reply as a Gujarati tutor. Reply in English. Reply in JSON format:
          {"gpt_response": "your reply",
           "user_message_english": "user message"} 
      }

      else{
        return only {"gpt_response": "Would you like to practice a conversation through roleplay or learn more about the language?",
          "user_message_english": "user message" }
      }`,
  },
];
async function callOpenAIWithTranscription(
  gujaratiTranscription,
  englishTranscription
) {
  conversationArray.push({
    role: "user",
    content: `{"Gujarati transcription" : "${gujaratiTranscription}",
"English transcription": "${englishTranscription}"}`,
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

const { conversationArray, callOpenAIWithTranscription } = require("../Services/PromptAI");

describe("callOpenAIWithTranscription function", () => {
  beforeEach(() => {
    conversationArray.length = 0;
  });

  it("should add user input to conversationArray and return AI response", async () => {
    const gujaratiTranscription = "તમે કેમ છો";
    const englishTranscription = "How are you?";

    const response = await callOpenAIWithTranscription(
      gujaratiTranscription,
      englishTranscription
    );

    const chatCompletion = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: "હું સારું કામ કરી રહ્યો છું." } }],
          }),
        },
      },
    };

    expect(conversationArray).toHaveLength(2);
    expect(conversationArray[0].role).toBe("user");
    expect(response).toBe("હું સારું કામ કરી રહ્યો છું.");
  });
});

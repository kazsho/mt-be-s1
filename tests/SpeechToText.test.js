const speech = require('@google-cloud/speech');

const mockRecognizeResponse = {
    results: [
      { alternatives: [{ transcript: 'Hello world' }] }
    ]
};
const mockSpeechClient = {
recognize: jest.fn().mockResolvedValue([mockRecognizeResponse])
};
jest.mock('@google-cloud/speech', () => ({
SpeechClient: jest.fn().mockImplementation(() => mockSpeechClient)
}));

const { transcribeGujarati, speechToText } = require('../Services/SpeechToText');

describe('speechToText function', () => {

  it('should return transcription with specified language code', async () => {
    const languageCode = 'gu-IN';
    const audioData = Buffer.from('mock-audio-data').toString('base64');

    const results = await transcribeGujarati(audioData);

    expect(mockSpeechClient.recognize).toHaveBeenCalledWith({
      audio: { content: Buffer.from(audioData, 'base64') },
      config: {
        encoding: 'FLAC',
        sampleRateHertz: 48000,
        languageCode: languageCode,
        audioChannelCount: 1,
        enableSeparateRecognitionPerChannel: false
      }
    });
    expect(results).toEqual([mockRecognizeResponse.results]);
  });

  it('should throw an error if recognition fails', async () => {
    const audioData = Buffer.from('mock-audio-data').toString('base64');

    mockSpeechClient.recognize.mockRejectedValue(new Error('Recognition failed'));

    await expect(transcribeGujarati(audioData)).rejects.toThrow('Recognition failed');
  });
});
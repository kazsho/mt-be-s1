const { speechToText } = require('../models/SpeechToText'); // Adjust the import path as needed
const speech = require('@google-cloud/speech'); // Assuming you have this dependency

// Mock the SpeechClient
jest.mock('@google-cloud/speech', () => ({
  SpeechClient: jest.fn(() => ({
    recognize: jest.fn().mockResolvedValue({
      results: [{
        alternatives: [{ transcript: 'Mocked transcription' }]
      }]
    })
  }))
}));

describe('speechToText function', () => {
  it('should transcribe audio data to text', async () => {
    // Mock audio data (base64 encoded)
    const audioData = Buffer.from('mock-audio-data', 'base64');

    // Call the function
    const transcription = await speechToText(audioData);

    // Assertions
    expect(transcription).toEqual('Mocked transcription');
    expect(speech.SpeechClient).toHaveBeenCalled();
    expect(speech.SpeechClient.mock.instances[0].recognize).toHaveBeenCalledWith({
      audio: { content: audioData },
      config: {
        encoding: 'FLAC',
        sampleRateHertz: 48000,
        languageCode: 'gu-IN',
        audioChannelCount: 1,
        enableSeparateRecognitionPerChannel: false
      }
    });
  });

  it('should throw an error if recognition fails', async () => {
    // Mock audio data (base64 encoded)
    const audioData = Buffer.from('mock-audio-data', 'base64');

    // Mock recognition failure
    speech.SpeechClient.mockImplementationOnce(() => ({
      recognize: jest.fn().mockRejectedValue(new Error('Recognition failed'))
    }));

    // Ensure the function throws an error
    await expect(speechToText(audioData)).rejects.toThrow('Recognition failed');
  });
});

const request = require('supertest');
const { mockRequest, mockResponse } = require('jest-mock-req-res');
const app = require('../app');
let { generateAudioData } = require('../app')

describe('Express App', () => {

    const mockAudioData = 'mock-audio-data';
    const req = mockRequest({
    body: {
        audio: mockAudioData
    }
    });
    const audioData = req.body.audio

  it('should return app information for GET /', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      name: 'Language app',
      description: 'An app that utilizes AI to help teach languages',
    });
  });

  it('should process audio data for POST /receive', async () => {
    jest.spyOn(require('../Services/SpeechToText'), 'speechToText').mockResolvedValue('mock-transcription');
    jest.spyOn(require('../Services/PromptAI'), 'callOpenAIWithTranscription').mockResolvedValue('mock-reply');

    const response = await request(app)
      .post('/receive')
      .send({ audio: audioData });

    expect(response.status).toBe(200); /* Showing 500 status code instead */
    expect(response.text).toBe('Audio received, transcribed, and processed successfully');
    expect(require('../Services/SpeechToText').speechToText).toHaveBeenCalledWith(audioData);
    expect(require('../Services/PromptAI').callOpenAI).toHaveBeenCalledWith('mock-transcription');
  });

  it('should return audio data for GET /send', async () => {
    generateAudioData = jest.fn().mockReturnValue(audioData);

    const response = await request(app).get('/send');

    expect(response.status).toBe(200); /* generateAudioData(); not defined in app.js - Showing 500 status code instead*/
    expect(response.headers['content-type']).toBe('audio/mp3');
  });
});

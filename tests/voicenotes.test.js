const VoiceNotes = require('../Models/voicenotes');
const db = require('../Database/connect');

jest.mock('../Database/connect', () => ({
  query: jest.fn(),
}));

describe('VoiceNotes class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll method', () => {
    it('should return all voice notes', async () => {
      const mockRows = [{ audio_id: 1, conversation_id: 1, audio_data: 'mocked-audio-data' }];
      db.query.mockResolvedValue({ rows: mockRows });

      const voiceNotes = await VoiceNotes.getAll();

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM audios;');
      expect(voiceNotes).toHaveLength(1);
      expect(voiceNotes[0]).toBeInstanceOf(VoiceNotes);
    });

    it('should throw an error if no voice notes available', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(VoiceNotes.getAll()).rejects.toThrow('No audios available.');
    });
  });

  describe('getByConversation method', () => {
    it('should return voice notes by conversation id', async () => {
      const conversationId = 1;
      const mockRow = { audio_id: 1, conversation_id: conversationId, audio_data: 'mocked-audio-data' };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const voiceNotes = await VoiceNotes.getByConversation(conversationId);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM audios WHERE conversation_id=$1;', [conversationId]);
      expect(voiceNotes).toHaveLength(1);
      expect(voiceNotes[0]).toBeInstanceOf(VoiceNotes);
    });

    it('should throw an error if voice notes not found by conversation id', async () => {
      const conversationId = 1;
      db.query.mockResolvedValue({ rows: [] });

      await expect(VoiceNotes.getByConversation(conversationId)).rejects.toThrow('Unable to locate audios for the conversation.');
    });
  });

  describe('getOneById method', () => {
    it('should return voice notes by id', async () => {
      const audioId = 1;
      const mockRow = { audio_id: audioId, conversation_id: 1, audio_data: 'mocked-audio-data' };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const voiceNotes = await VoiceNotes.getOneById(audioId);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM audios WHERE conversation_id=$1;', [audioId]);
      expect(voiceNotes).toBeInstanceOf(VoiceNotes);
    });

    it('should throw an error if voice notes not found by id', async () => {
      const audioId = 1;
      db.query.mockResolvedValue({ rows: [] });

      await expect(VoiceNotes.getOneById(audioId)).rejects.toThrow('Unable to locate audios.');
    });
  });

  describe('create method', () => {
    it('should create a voice note', async () => {
      const data = { audio_id: 1, conversation_id: 1, audio_data: 'mocked-audio-data' };
      const mockResponse = { rows: [{ audio_id: 1, conversation_id: 1, audio_data: 'mocked-audio-data' }] };
      db.query.mockResolvedValue(mockResponse);

      const voiceNote = await VoiceNotes.create(data);

      expect(db.query).toHaveBeenCalledWith('INSERT INTO conversations (audio_id, conversation_id, audio_data) VALUES ($1, $2, $3) RETURNING *;', [data.audio_id, data.conversation_id, data.audio_data]);
      expect(voiceNote).toBeInstanceOf(VoiceNotes);
    });

    it('should throw an error if unable to save voice recording', async () => {
      const data = { audio_id: 1, conversation_id: 1, audio_data: 'mocked-audio-data' };
      db.query.mockResolvedValue({ rows: [] });

      await expect(VoiceNotes.create(data)).rejects.toThrow('Unable to save voice recordings.');
    });
  });

  describe('update method', () => {
    it('should update a voice note', async () => {
      const voiceNote = new VoiceNotes({ audio_id: 1, conversation_id: 1, audio_data: 'mocked-audio-data' });
      const newData = { audio_data: 'new-mocked-audio-data' };
      const mockResponse = { rows: [{ audio_id: 1, conversation_id: 1, audio_data: 'new-mocked-audio-data' }] };
      db.query.mockResolvedValue(mockResponse);

      const updatedVoiceNote = await voiceNote.update(newData);

      expect(db.query).toHaveBeenCalledWith('UPDATE audios SET audio_data = $1 WHERE audio_id = $2 RETURNING *;', [newData.audio_data, voiceNote.audio_id]);
      expect(updatedVoiceNote).toBeInstanceOf(VoiceNotes);
      expect(updatedVoiceNote.audio_data).toEqual(newData.audio_data);
    });

    it('should throw an error if unable to update conversation title', async () => {
      const voiceNote = new VoiceNotes({ audio_id: 1, conversation_id: 1, audio_data: 'mocked-audio-data' });
      const newData = { audio_data: 'new-mocked-audio-data' };
      db.query.mockResolvedValue({ rows: [] });

      await expect(voiceNote.update(newData)).rejects.toThrow('Unable to update audio data.');
    });
  });

  describe('destroy method', () => {
    it('should delete a voice note', async () => {
      const voiceNote = new VoiceNotes({ audio_id: 1, conversation_id: 1, audio_data: 'mocked-audio-data' });
      const mockResponse = { rows: [{ audio_id: 1, conversation_id: 1, audio_data: 'mocked-audio-data' }] };
      db.query.mockResolvedValue(mockResponse);

      const deletedVoiceNote = await voiceNote.destroy();

      expect(db.query).toHaveBeenCalledWith('DELETE FROM audios WHERE audios_id = $1 RETURNING *;', [voiceNote.audio_id]);
      expect(deletedVoiceNote).toBeInstanceOf(VoiceNotes);
    });
  });
});

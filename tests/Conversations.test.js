const Conversation = require('../Models/Conversations'); // Assuming Conversation class is in Conversation.js
const db = require('../Database/connect');

jest.mock('../Database/connect', () => ({
  query: jest.fn(),
}));

describe('Conversation class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll method', () => {
    it('should return all conversations', async () => {
      const mockRows = [{ conversation_id: 1, account_id: 1, conversation_title: 'Test Conversation', language: 'English', timestamp: new Date() }];
      db.query.mockResolvedValue({ rows: mockRows });

      const conversations = await Conversation.getAll();

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM conversations;');
      expect(conversations).toHaveLength(1);
      expect(conversations[0]).toBeInstanceOf(Conversation);
    });

    it('should throw an error if no conversations available', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Conversation.getAll()).rejects.toThrow('No conversations available.');
    });
  });

  describe('getByUser method', () => {
    it('should return conversations by user id', async () => {
      const userId = 1;
      const mockRows = [{ conversation_id: 1, account_id: userId, conversation_title: 'Test Conversation', language: 'English', timestamp: new Date() }];
      db.query.mockResolvedValue({ rows: mockRows });

      const conversations = await Conversation.getByUser(userId);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM conversations WHERE account_id=$1;', [userId]);
      expect(conversations).toHaveLength(1);
      expect(conversations[0]).toBeInstanceOf(Conversation);
    });

    it('should throw an error if no conversations found for user', async () => {
      const userId = 1;
      db.query.mockResolvedValue({ rows: [] });

      await expect(Conversation.getByUser(userId)).rejects.toThrow('Unable to locate conversations for the user.');
    });
  });

  describe('getOneById method', () => {
    it('should return conversation by id', async () => {
      const conversationId = 1;
      const mockRow = { conversation_id: conversationId, account_id: 1, conversation_title: 'Test Conversation', language: 'English', timestamp: new Date() };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const conversation = await Conversation.getOneById(conversationId);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM conversations WHERE conversation_id=$1;', [conversationId]);
      expect(conversation).toBeInstanceOf(Conversation);
    });

    it('should throw an error if conversation not found', async () => {
      const conversationId = 1;
      db.query.mockResolvedValue({ rows: [] });

      await expect(Conversation.getOneById(conversationId)).rejects.toThrow('Unable to locate conversation.');
    });
  });

  describe('create method', () => {
    it('should create a conversation', async () => {
      const data = { account_id: 1, conversation_title: 'Test Conversation', language: 'English' };
      const mockResponse = { rows: [{ conversation_id: 1, ...data, timestamp: new Date() }] };
      db.query.mockResolvedValue(mockResponse);

      const conversation = await Conversation.create(data);

      expect(db.query).toHaveBeenCalledWith('INSERT INTO conversations (account_id, conversation_title, language, timestamp) VALUES ($1, $2, $3, $4) RETURNING *;', [data.account_id, data.conversation_title, data.language, expect.any(Date)]);
      expect(conversation).toBeInstanceOf(Conversation);
    });

    it('should throw an error if unable to create conversation', async () => {
      const data = { account_id: 1, conversation_title: 'Test Conversation', language: 'English' };
      db.query.mockResolvedValue({ rows: [] });

      await expect(Conversation.create(data)).rejects.toThrow('Unable to create conversation.');
    });
  });

  describe('update method', () => {
    it('should update a conversation', async () => {
      const conversation = new Conversation({ conversation_id: 1, account_id: 1, conversation_title: 'Test Conversation', language: 'English', timestamp: new Date() });
      const newData = { conversation_title: 'Updated Title' };
      const mockResponse = { rows: [{ conversation_id: 1, account_id: 1, conversation_title: 'Updated Title', language: 'English', timestamp: new Date() }] };
      db.query.mockResolvedValue(mockResponse);

      const updatedConversation = await conversation.update(newData);

      expect(db.query).toHaveBeenCalledWith('UPDATE conversations SET conversation_title = $1 WHERE conversation_id = $2 RETURNING *;', [newData.conversation_title, conversation.conversation_id]);
      expect(updatedConversation).toBeInstanceOf(Conversation);
      expect(updatedConversation.conversation_title).toEqual(newData.conversation_title);
    });

    it('should throw an error if unable to update conversation', async () => {
      const conversation = new Conversation({ conversation_id: 1, account_id: 1, conversation_title: 'Test Conversation', language: 'English', timestamp: new Date() });
      const newData = { conversation_title: 'Updated Title' };
      db.query.mockResolvedValue({ rows: [] });

      await expect(conversation.update(newData)).rejects.toThrow('Unable to update conversation title.');
    });
  });

  describe('destroy method', () => {
    it('should delete a conversation', async () => {
      const conversation = new Conversation({ conversation_id: 1, account_id: 1, conversation_title: 'Test Conversation', language: 'English', timestamp: new Date() });
      const mockResponse = { rows: [{ conversation_id: 1, account_id: 1, conversation_title: 'Test Conversation', language: 'English', timestamp: new Date() }] };
      db.query.mockResolvedValue(mockResponse);

      const deletedConversation = await conversation.destroy();

      expect(db.query).toHaveBeenCalledWith('DELETE FROM conversations WHERE conversation_id = $1 RETURNING *;', [conversation.conversation_id]);
      expect(deletedConversation).toBeInstanceOf(Conversation);
    });
  });
});

const Token = require('../Models/Tokens');
const db = require('../Database/connect');

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid'),
}));

jest.mock('../Database/connect', () => ({
  query: jest.fn(),
}));

describe('Token class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll method', () => {
    it('should return all tokens', async () => {
      const mockRows = [{ token_id: 1, account_id: 1, token: 'mocked-uuid' }];
      db.query.mockResolvedValue({ rows: mockRows });

      const tokens = await Token.getAll();

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM tokens;');
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toBeInstanceOf(Token);
    });

    it('should throw an error if no tokens available', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Token.getAll()).rejects.toThrow('No tokens available.');
    });
  });

  describe('getOneByProfile method', () => {
    it('should return token by profile id', async () => {
      const accountId = 1;
      const mockRow = { token_id: 1, account_id: accountId, token: 'mocked-uuid' };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const token = await Token.getOneByProfile(accountId);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM tokens WHERE account_id = $1', [accountId]);
      expect(token).toBeInstanceOf(Token);
    });

    it('should throw an error if token not found by profile id', async () => {
      const accountId = 1;
      db.query.mockResolvedValue({ rows: [] });

      await expect(Token.getOneByProfile(accountId)).rejects.toThrow('Unable to locate token.');
    });
  });

  describe('getOneByToken method', () => {
    it('should return token by token value', async () => {
      const tokenValue = 'mocked-uuid';
      const mockRow = { token_id: 1, account_id: 1, token: tokenValue };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const token = await Token.getOneByToken(tokenValue);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM tokens WHERE token = $1', [tokenValue]);
      expect(token).toBeInstanceOf(Token);
    });

    it('should throw an error if token not found by token value', async () => {
      const tokenValue = 'nonexistent-token';
      db.query.mockResolvedValue({ rows: [] });

      await expect(Token.getOneByToken(tokenValue)).rejects.toThrow('Unable to locate token.');
    });
  });

  describe('create method', () => {
    it('should create a token', async () => {
      const accountId = 1;
      const mockResponse = { rows: [{ token_id: 1, account_id: accountId, token: 'mocked-uuid' }] };
      db.query.mockResolvedValue(mockResponse);

      const token = await Token.create(accountId);

      expect(db.query).toHaveBeenCalledWith('INSERT INTO tokens (account_id, token) VALUES ($1, $2) RETURNING *;', [accountId, 'mocked-uuid']);
      expect(token).toBeInstanceOf(Token);
    });
  });

  describe('destroy method', () => {
    it('should delete a token', async () => {
      const tokenValue = 'mocked-uuid';
      const token = new Token({ token_id: 1, account_id: 1, token: tokenValue });
      const mockResponse = { rows: [{ token_id: 1, account_id: 1, token: tokenValue }] };
      db.query.mockResolvedValue(mockResponse);

      const deletedToken = await token.destroy(tokenValue);

      expect(db.query).toHaveBeenCalledWith('DELETE FROM tokens WHERE token = $1 RETURNING *;', [tokenValue]);
      expect(deletedToken).toBeInstanceOf(Token);
    });

    it('should throw an error if unable to delete token', async () => {
      const tokenValue = 'mocked-uuid';
      const token = new Token({ token_id: 1, account_id: 1, token: tokenValue });
      db.query.mockResolvedValue({ rows: [] });

      await expect(token.destroy(tokenValue)).rejects.toThrow('Unable to delete token.');
    });
  });
});

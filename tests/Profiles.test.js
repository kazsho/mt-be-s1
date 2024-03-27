const Profile = require('../Models/Profiles');
const db = require('../Database/connect');

jest.mock('../Database/connect', () => ({
  query: jest.fn(),
}));

describe('Profile class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll method', () => {
    it('should return all profiles', async () => {
      const mockRows = [{ account_id: 1, name: 'Korra', email: 'korra@avatar.com', password: 'password' }];
      db.query.mockResolvedValue({ rows: mockRows });

      const profiles = await Profile.getAll();

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM profiles;');
      expect(profiles).toHaveLength(1);
      expect(profiles[0]).toBeInstanceOf(Profile);
    });

    it('should throw an error if no profiles available', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Profile.getAll()).rejects.toThrow('No profiles available.');
    });
  });

  describe('getOneById method', () => {
    it('should return profile by id', async () => {
      const accountId = 1;
      const mockRow = { account_id: accountId, name: 'Korra', email: 'korra@avatar.com', password: 'password' };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const profile = await Profile.getOneById(accountId);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM profiles WHERE account_id=$1;', [accountId]);
      expect(profile).toBeInstanceOf(Profile);
    });

    it('should throw an error if profile not found', async () => {
      const accountId = 1;
      db.query.mockResolvedValue({ rows: [] });

      await expect(Profile.getOneById(accountId)).rejects.toThrow('Unable to locate profile.');
    });
  });

  describe('getOneByEmail method', () => {
    it('should return profile by email', async () => {
      const email = 'korra@avatar.com';
      const mockRow = { account_id: 1, name: 'Korra', email: email, password: 'password' };
      db.query.mockResolvedValue({ rows: [mockRow] });

      const profile = await Profile.getOneByEmail(email);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM profiles WHERE email=$1;', [email]);
      expect(profile).toBeInstanceOf(Profile);
    });

    it('should throw an error if profile not found by email', async () => {
      const email = 'katara@avatar.com';
      db.query.mockResolvedValue({ rows: [] });

      await expect(Profile.getOneByEmail(email)).rejects.toThrow('Unable to locate profile.');
    });
  });

  describe('create method', () => {
    it('should create a profile', async () => {
      const data = { name: 'Aang', email: 'aang@avatar.com', password: 'password' };
      db.query.mockResolvedValueOnce({ rows: [] });
      const mockResponse = { rows: [{ account_id: 1, ...data }] };
      db.query.mockResolvedValue(mockResponse);

      const profile = await Profile.create(data);

      expect(db.query).toHaveBeenCalledWith('INSERT INTO profiles (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [data.name, data.email, data.password]);
      expect(profile).toBeInstanceOf(Profile);
    });

    it('should throw an error if email already exists', async () => {
      const data = { name: 'Korra', email: 'korra@avatar.com', password: 'password' };
      db.query.mockResolvedValue({ rows: [{ email: data.email }] });

      await expect(Profile.create(data)).rejects.toThrow('Email already exists');
    });
  });

  describe('update method', () => {
    it('should update a profile', async () => {
      const profile = new Profile({ account_id: 1, name: 'Aang', email: 'aang@example.com', password: 'password' });
      const newData = { name: 'The Last Airbender' };
      const mockResponse = { rows: [{ account_id: 1, name: newData.name, email: 'aang@example.com', password: 'password' }] };
      db.query.mockResolvedValue(mockResponse);

      const updatedProfile = await profile.update(newData);

      expect(db.query).toHaveBeenCalledWith('UPDATE profiles SET name = $1 WHERE account_id = $2 RETURNING *;', [newData.name, profile.account_id]);
      expect(updatedProfile).toBeInstanceOf(Profile);
      expect(updatedProfile.name).toEqual(newData.name);
    });

    it('should throw an error if unable to update profile', async () => {
      const profile = new Profile({ account_id: 1, name: 'Aang', email: 'aang@avatar.com', password: 'password' });
      const newData = { name: 'The Last Airbender' };
      db.query.mockResolvedValue({ rows: [] });

      await expect(profile.update(newData)).rejects.toThrow('Unable to update name.');
    });
  });

  describe('destroy method', () => {
    it('should delete a profile', async () => {
      const profile = new Profile({ account_id: 1, name: 'Kyoshi', email: 'ky@avatar.com', password: 'password' });
      const mockResponse = { rows: [{ account_id: 1, name: 'Kyoshi', email: 'ky@avatar.com', password: 'password' }] };
      db.query.mockResolvedValue(mockResponse);

      const deletedProfile = await profile.destroy();

      expect(db.query).toHaveBeenCalledWith('DELETE FROM profiles WHERE account_id = $1 RETURNING *;', [profile.account_id]);
      expect(deletedProfile).toBeInstanceOf(Profile);
    });
  });
});

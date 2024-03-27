const bcrypt = require("bcrypt");
const { index, show, login, create, update, destroy } = require("../controllers/profiles");

const Profile = require("../Models/Profiles");
const Token = require("../Models/Tokens");

jest.mock("../Models/Profiles");
jest.mock("../Models/Tokens");

describe("Controller functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("index", () => {
    it("should return all profiles", async () => {
      const mockedProfiles = [{ id: 1, name: "Korra", email: "korra@avatar.com" }];
      Profile.getAll.mockResolvedValue(mockedProfiles);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await index(req, res);

      expect(Profile.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedProfiles);
    });

    it("should handle errors and respond with status 500", async () => {
      Profile.getAll.mockRejectedValue(new Error("Database error"));

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await index(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("show", () => {
    it("should return a profile by id", async () => {
      const profileId = 1;
      const mockedProfile = { id: profileId, name: "Korra", email: "korra@avatar.com" };
      Profile.getOneById.mockResolvedValue(mockedProfile);

      const req = { params: { id: profileId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await show(req, res);

      expect(Profile.getOneById).toHaveBeenCalledWith(profileId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedProfile);
    });

    it("should handle errors and respond with status 404", async () => {
      const profileId = 9;
      Profile.getOneById.mockRejectedValue(new Error("Profile not found"));

      const req = { params: { id: profileId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await show(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Profile not found" });
    });
  });

  describe("login", () => {
    it("should login and return a token", async () => {
        const requestData = { email: "john@example.com", password: "password123" };
        const hashedPassword = await bcrypt.hash(requestData.password, 10);
        const mockedProfile = { id: 1, name: "John Doe", email: requestData.email, password: hashedPassword };
        const mockedToken = { token: "mocked-token" };
        
        Profile.getOneByEmail.mockResolvedValue(mockedProfile);
        
        bcrypt.compare = jest.fn().mockImplementation((password, hashedPassword) => {
          return Promise.resolve(true);
        });
      
        Token.create.mockResolvedValue(mockedToken);
      
        const req = { body: requestData };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        await login(req, res);
      
        expect(Profile.getOneByEmail).toHaveBeenCalledWith(requestData.email);
        expect(bcrypt.compare).toHaveBeenCalledWith(requestData.password, mockedProfile.password);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ authenticated: true, token: mockedToken.token });
      });
      
    it("should handle incorrect credentials and respond with status 403", async () => {
      const requestData = { email: "korra@avatar.com", password: "wrong" };
      const mockedProfile = { id: 1, name: "Korra", email: requestData.email, password: "hashed-password" };

      Profile.getOneByEmail.mockResolvedValue(mockedProfile);
      bcrypt.compare.mockResolvedValue(false);

      const req = { body: requestData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(Profile.getOneByEmail).toHaveBeenCalledWith(requestData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(requestData.password, mockedProfile.password);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "Incorrect credentials." });
    });
  });

  describe("create", () => {
    it("should create a new profile", async () => {
      const requestData = { name: "Aang", email: "aang@avatar.com", password: "password" };
      const mockedProfile = { id: 1, ...requestData };
      
      Profile.create.mockResolvedValue(mockedProfile);

      const req = { body: requestData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await create(req, res);

      expect(Profile.create).toHaveBeenCalledWith(requestData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockedProfile);
    });

    it("should handle errors and respond with status 400", async () => {
      const requestData = { name: "Aang", email: "aang@avatar.com", password: "password" };

      Profile.create.mockRejectedValue(new Error("Invalid data"));

      const req = { body: requestData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid data" });
    });
  });

  describe("update", () => {
    it("should update a profile", async () => {
        const profileId = 1;
        const requestData = { name: "John Doe Jr." };
        const mockedProfile = { id: profileId, name: "John Doe", email: "john@example.com", password: "hashed-password" };
        const updatedProfile = { ...mockedProfile, ...requestData };
      
        Profile.getOneById.mockResolvedValue(mockedProfile);
        
        mockedProfile.update = jest.fn().mockResolvedValue(updatedProfile);
      
        const req = { params: { id: profileId }, body: requestData };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        await update(req, res);
      
        expect(Profile.getOneById).toHaveBeenCalledWith(profileId);
        expect(mockedProfile.update).toHaveBeenCalledWith(requestData);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedProfile);
    });
      
    it("should handle errors and respond with status 404", async () => {
      const profileId = 9;
      const requestData = { name: "John Doe Jr." };

      Profile.getOneById.mockRejectedValue(new Error("Profile not found"));

      const req = { params: { id: profileId }, body: requestData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Profile not found" });
    });
  });

  describe("destroy", () => {
    it("should destroy a profile", async () => {
        const profileId = 1;
        const mockedProfile = { id: profileId, name: "John Doe", email: "john@example.com", password: "hashed-password" };
      
        Profile.getOneById.mockResolvedValue(mockedProfile);
        
        mockedProfile.destroy = jest.fn().mockResolvedValue();
      
        const req = { params: { id: profileId } };
        const res = {
          status: jest.fn().mockReturnThis(),
          end: jest.fn(),
        };
      
        await destroy(req, res);
      
        expect(Profile.getOneById).toHaveBeenCalledWith(profileId);
        expect(mockedProfile.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.end).toHaveBeenCalled();
    });
      

    it("should handle errors and respond with status 404", async () => {
      const profileId = 9;

      Profile.getOneById.mockRejectedValue(new Error("Profile not found"));

      const req = { params: { id: profileId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Profile not found" });
    });
  });
});

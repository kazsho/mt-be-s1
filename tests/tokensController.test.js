const { index, show, create, destroy } = require("../controllers/tokens");
const Token = require("../Models/Tokens");

jest.mock("../Models/Tokens");

describe("Controller functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("index", () => {
    it("should return all tokens", async () => {
      const mockedTokens = [{ id: 1, token: "mocked-token" }];
      Token.getAll.mockResolvedValue(mockedTokens);

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await index(req, res);

      expect(Token.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedTokens);
    });

    it("should handle errors and respond with status 500", async () => {
      Token.getAll.mockRejectedValue(new Error("Database error"));

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await index(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("show", () => {
    it("should return a token by token", async () => {
      const tokenCode = "mocked-token";
      const mockedToken = { id: 1, token: tokenCode };
      Token.getOneByToken.mockResolvedValue(mockedToken);

      const req = { params: { token: tokenCode } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await show(req, res);

      expect(Token.getOneByToken).toHaveBeenCalledWith(tokenCode);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedToken);
    });

    it("should handle errors and respond with status 404", async () => {
      const tokenCode = "non-existing-token";
      Token.getOneByToken.mockRejectedValue(new Error("Token not found"));

      const req = { params: { token: tokenCode } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await show(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Token not found" });
    });
  });

  describe("create", () => {
    it("should create a new token", async () => {
      const id = 1;
      const newToken = { id: 2, token: "new-token" };
      Token.create.mockResolvedValue(newToken);

      const req = { params: { id: id } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await create(req, res);

      expect(Token.create).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newToken);
    });

    it("should handle errors and respond with status 400", async () => {
      const id = 1;
      Token.create.mockRejectedValue(new Error("Invalid data"));

      const req = { params: { id: id } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid data" });
    });
  });

  describe("destroy", () => {
    it("should delete a token", async () => {
      const tokenCode = "mocked-token";
      const mockedToken = { id: 1, token: tokenCode };
      const mockedDestroyResult = {};

      Token.getOneByToken.mockResolvedValue(mockedToken);

      mockedToken.destroy = jest.fn().mockResolvedValue(mockedDestroyResult);

      const req = { params: { token: tokenCode } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), end: jest.fn() };

      await destroy(req, res);

      expect(Token.getOneByToken).toHaveBeenCalledWith(tokenCode);
      expect(mockedToken.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it("should handle errors and respond with status 404", async () => {
      const tokenCode = "non-existing-token";
      Token.getOneByToken.mockRejectedValue(new Error("Token not found"));

      const req = { params: { token: tokenCode } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Token not found" });
    });
  });
});
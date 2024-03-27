const Conversation = require("../Models/Conversations");

jest.mock("../Models/Conversations");

const {index, showUser, show, create, update, destroy} = require("../controllers/conversations");

describe("Controller functions", () => {
  describe("index", () => {
    it("should return all conversations", async () => {
      const mockedConversations = [
        { id: 1, title: "Conversation 1" },
        { id: 2, title: "Conversation 2" },
      ];
      Conversation.getAll.mockResolvedValue(mockedConversations);

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await index(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedConversations);
    });

    it("should handle errors", async () => {
      const errorMessage = "Internal server error";
      Conversation.getAll.mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await index(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("showUser", () => {
    it("should return conversations for a user", async () => {
      const userId = 1;
      const mockedConversations = [
        { id: 1, title: "Conversation 1" },
        { id: 2, title: "Conversation 2" },
      ];
      Conversation.getByUser.mockResolvedValue(mockedConversations);

      const req = { params: { id: userId } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await showUser(req, res);

      expect(Conversation.getByUser).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedConversations);
    });

    it("should handle errors", async () => {
      const userId = 1;
      const errorMessage = "User not found";
      Conversation.getByUser.mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: userId } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await showUser(req, res);

      expect(Conversation.getByUser).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("show", () => {
    it("should return a conversation by ID", async () => {
      const conversationId = 1;
      const mockedConversation = {
        id: conversationId,
        title: "Conversation 1",
      };
      Conversation.getOneById.mockResolvedValue(mockedConversation);

      const req = { params: { id: conversationId } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await show(req, res);

      expect(Conversation.getOneById).toHaveBeenCalledWith(conversationId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedConversation);
    });

    it("should handle errors", async () => {
      const conversationId = 1;
      const errorMessage = "Conversation not found";
      Conversation.getOneById.mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: conversationId } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await show(req, res);

      expect(Conversation.getOneById).toHaveBeenCalledWith(conversationId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("create", () => {
    it("should create a new conversation", async () => {
      const requestData = { title: "New Conversation" };
      const mockedConversation = { id: 1, title: requestData.title };
      Conversation.create.mockResolvedValue(mockedConversation);

      const req = { body: requestData };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await create(req, res);

      expect(Conversation.create).toHaveBeenCalledWith(requestData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockedConversation);
    });

    it("should handle errors", async () => {
      const requestData = { title: "New Conversation" };
      const errorMessage = "Unable to create conversation";
      Conversation.create.mockRejectedValue(new Error(errorMessage));

      const req = { body: requestData };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await create(req, res);

      expect(Conversation.create).toHaveBeenCalledWith(requestData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("update", () => {
    it("should update a conversation", async () => {
      const conversationId = 1;
      const requestData = { title: "Updated Conversation" };
      const mockedConversation = {
        id: conversationId,
        title: "Conversation 1",
        update: jest.fn(),
      };
      Conversation.getOneById.mockResolvedValue(mockedConversation);
      const updatedConversation = {
        id: conversationId,
        title: requestData.title,
      };
      mockedConversation.update.mockResolvedValue(updatedConversation);

      const req = { params: { id: conversationId }, body: requestData };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await update(req, res);

      expect(Conversation.getOneById).toHaveBeenCalledWith(conversationId);
      expect(mockedConversation.update).toHaveBeenCalledWith(requestData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedConversation);
    });

    it("should handle errors", async () => {
      const conversationId = 1;
      const requestData = { title: "Updated Conversation" };
      const errorMessage = "Conversation not found";
      Conversation.getOneById.mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: conversationId }, body: requestData };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await update(req, res);

      expect(Conversation.getOneById).toHaveBeenCalledWith(conversationId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("destroy", () => {
    it("should destroy a conversation", async () => {
      const conversationId = 1;
      const mockedConversation = {
        id: conversationId,
        title: "Conversation 1",
        destroy: jest.fn(),
      };
      Conversation.getOneById.mockResolvedValue(mockedConversation);
      const mockedDestroyResult = {};
      mockedConversation.destroy.mockResolvedValue(mockedDestroyResult);

      const req = { params: { id: conversationId } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), end: jest.fn() };

      await destroy(req, res);

      expect(Conversation.getOneById).toHaveBeenCalledWith(conversationId);
      expect(mockedConversation.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const conversationId = 1;
      const errorMessage = "Conversation not found";
      Conversation.getOneById.mockRejectedValue(new Error(errorMessage));

      const req = { params: { id: conversationId } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await destroy(req, res);

      expect(Conversation.getOneById).toHaveBeenCalledWith(conversationId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});

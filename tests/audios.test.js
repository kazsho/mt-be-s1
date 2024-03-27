const { index, showConversation, show, create, update, destroy } = require("../controllers/audios");
const VoiceNotes = require("../Models/voicenotes.js");

jest.mock("../Models/voicenotes.js");

describe("Controller functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("index", () => {
    it("should return all voice notes", async () => {
      const mockedVoiceNotes = [{ id: 1, audio_data: "mocked-audio-data" }];
      VoiceNotes.getAll.mockResolvedValue(mockedVoiceNotes);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await index(req, res);

      expect(VoiceNotes.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedVoiceNotes);
    });

    it("should handle errors and respond with status 500", async () => {
      VoiceNotes.getAll.mockRejectedValue(new Error("Database error"));

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

  describe("showConversation", () => {
    it("should return voice notes for a conversation", async () => {
      const conversationId = 1;
      const mockedVoiceNotes = [{ id: 1, audio_data: "mocked-audio-data" }];
      VoiceNotes.getByConversation.mockResolvedValue(mockedVoiceNotes);

      const req = { params: { id: conversationId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await showConversation(req, res);

      expect(VoiceNotes.getByConversation).toHaveBeenCalledWith(conversationId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedVoiceNotes);
    });

    it("should handle errors and respond with status 404", async () => {
      const conversationId = 1;
      VoiceNotes.getByConversation.mockRejectedValue(new Error("Conversation not found"));

      const req = { params: { id: conversationId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await showConversation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Conversation not found"});
    });
  });

  describe("show", () => {
    it("should return a voice note by id", async () => {
      const audioId = 1;
      const mockedVoiceNote = { id: audioId, audio_data: "mocked-audio-data" };
      VoiceNotes.getOneById.mockResolvedValue(mockedVoiceNote);

      const req = { params: { id: audioId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await show(req, res);

      expect(VoiceNotes.getOneById).toHaveBeenCalledWith(audioId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedVoiceNote);
    });

    it("should handle errors and respond with status 404", async () => {
      const audioId = 1;
      VoiceNotes.getOneById.mockRejectedValue(new Error("Voice note not found"));

      const req = { params: { id: audioId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await show(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Voice note not found" });
    });
  });

  describe("create", () => {
    it("should create a new voice note", async () => {
      const newVoiceNoteData = { audio_data: "new-audio-data" };
      const createdVoiceNote = {
        id: 1,
        audio_data: newVoiceNoteData.audio_data,
      };
      VoiceNotes.create.mockResolvedValue(createdVoiceNote);

      const req = { body: newVoiceNoteData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await create(req, res);

      expect(VoiceNotes.create).toHaveBeenCalledWith(newVoiceNoteData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdVoiceNote);
    });

    it("should handle errors and respond with status 400", async () => {
      const newVoiceNoteData = { audio_data: "new-audio-data" };
      VoiceNotes.create.mockRejectedValue(new Error("Invalid data"));

      const req = { body: newVoiceNoteData };
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
    it("should update a voice note", async () => {
      const audioId = 1;
      const updatedData = { audio_data: "updated-audio-data" };
      const voiceNote = { id: audioId, audio_data: "original-audio-data" };
      const updatedVoiceNote = {
        id: audioId,
        audio_data: updatedData.audio_data,
      };
      VoiceNotes.getOneById.mockResolvedValue(voiceNote);
      voiceNote.update.mockResolvedValue(updatedVoiceNote);

      const req = { params: { id: audioId }, body: updatedData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await update(req, res);

      expect(VoiceNotes.getOneById).toHaveBeenCalledWith(audioId);
      expect(voiceNote.update).toHaveBeenCalledWith(updatedData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedVoiceNote);
    });

    it("should handle errors and respond with status 404", async () => {
      const audioId = 1;
      const updatedData = { audio_data: "updated-audio-data" };
      VoiceNotes.getOneById.mockRejectedValue(new Error("Voice note not found"));

      const req = { params: { id: audioId }, body: updatedData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Voice note not found" });
    });
  });

  describe("destroy", () => {
    it("should delete a voice note", async () => {
      const audioId = 1;
      const voiceNoteData = { id: audioId, audio_data: "mocked-audio-data" };
      VoiceNotes.getOneById.mockResolvedValue(voiceNoteData);
      const voiceNoteInstance = { destroy: jest.fn().mockResolvedValue() };

      jest.spyOn(VoiceNotes, "getOneById").mockResolvedValue(voiceNoteInstance);

      const req = { params: { id: audioId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
        json: jest.fn(),
      };

      await destroy(req, res);

      expect(VoiceNotes.getOneById).toHaveBeenCalledWith(audioId);
      expect(voiceNoteInstance.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it("should handle errors and respond with status 404", async () => {
      const audioId = 1;
      VoiceNotes.getOneById.mockRejectedValue(new Error("Voice note not found"));

      const req = { params: { id: audioId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Voice note not found" });
    });
  });
});
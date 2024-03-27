const VoiceNotes = require("../Models/voicenotes.js");

async function index(req, res) {
  try {
    const voiceNotes = await VoiceNotes.getAll();
    res.status(200).json(voiceNotes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function showConversation(req, res) {
  try {
    let id = req.params.id;
    const voiceNotes = await VoiceNotes.getByConversation(id);
    res.status(200).json(voiceNotes);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

async function show(req, res) {
  try {
    let id = req.params.id;
    const voiceNotes = await VoiceNotes.getOneById(id);
    res.status(200).json(voiceNotes);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    const data = req.body;
    const newVoiceNotes = await VoiceNotes.create(data);
    res.status(201).json(newVoiceNotes);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    const voiceNotes = await VoiceNotes.getOneById(id);
    const result = await voiceNotes.update(data);
    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

async function destroy(req, res) {
  try {
    const id = req.params.id;
    const voiceNotes = await VoiceNotes.getOneById(id);
    const result = await voiceNotes.destroy();
    res.status(204).end();
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

module.exports = { index, showConversation, show, create, update, destroy };

const db = require("../Database/connect");

class VoiceNotes {
  constructor({ audio_id, conversation_id, audio_data }) {
    this.conversation_id = conversation_id;
    this.audio_id = audio_id;
    this.audio_data = audio_data;
    this.conversation_title = conversation_title;
  }

  static async getAll() {
    const response = await db.query("SELECT * FROM audios;");
    if (response.rows.length === 0) {
      throw new Error("No audios available.");
    }
    return response.rows.map((c) => new VoiceNotes(c));
  }

  static async getByConversation(id) {
    const response = await db.query(
      "SELECT * FROM audios WHERE conversation_id=$1;",
      [id]
    );

    if (response.rows.length === 1) {
      throw new Error("Unable to locate audios for the conversation.");
    }

    return response.rows.map((c) => new VoiceNotes(c));
  }

  static async getOneById(id) {
    const response = await db.query(
      "SELECT * FROM audios WHERE conversation_id=$1;",
      [id]
    );

    if (response.rows.length != 1) {
      throw new Error("Unable to locate audios.");
    }

    return new VoiceNotes(response.rows[0]);
  }

  static async create(data) {
    const { audio_id, conversation_id, audio_data } = data;

    let response = await db.query(
      "INSERT INTO conversations (audio_id, conversation_id, audio_data) VALUES ($1, $2, $3, $4) RETURNING *;",
      [audio_id, conversation_id, audio_data]
    );

    if (response.rows.length === 0) {
      throw new Error("Unable to save voice recordings.");
    }

    return new VoiceNotes(response.rows[0]);
  }

  async update(data) {
    const response = await db.query(
      "UPDATE audios SET conversation_title = $1 WHERE audios_id = $2 RETURNING *;",
      [data.conversation_title]
    );
    if (response.rows.length != 1) {
      throw new Error("Unable to update conversation title.");
    }
    return new VoiceNotes(response.rows[0]);
  }

  async destroy() {
    const response = await db.query(
      "DELETE FROM audios WHERE audios_id = $1 RETURNING *;",
      [audios_id]
    );
    return new VoiceNotes(response.rows[0]);
  }
}

module.exports = VoiceNotes;

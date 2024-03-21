const db = require("../Database/connect");

class User {
  constructor({ userid, username, password_hash }) {
    this.id = userid;
    this.username = username;
    this.password_hash = password_hash;
  }

  static async getOneById(id) {
    const response = await db.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    if (response.rows.length != 1) {
      throw new Error("Unable to locate user.");
    }
    return new User(response.rows[0]);
  }

  static async getOneByUsername(username) {
    const response = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (response.rows.length != 1) {
      throw new Error("Unable to locate user.");
    }
    return new User(response.rows[0]);
  }

  static async create(data) {
    const { username, email, password } = data;
    let response = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id;",
      [username, email, password]
    );
    const newId = response.rows[0].userid;
    const newUser = await User.getOneById(newId);
    return newUser;
  }
}

module.exports = User;

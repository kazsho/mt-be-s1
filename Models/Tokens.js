const { v4: uuidv4 } = require("uuid");

const db = require("../Database/connect");

class Token {
    constructor({ token_id, account_id, token }) {
        this.token_id = token_id;
        this.account_id = account_id;
        this.token = token;
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM tokens;");
        if (response.rows.length === 0) {
            throw new Error("No tokens available.")
        }
        return response.rows.map(t => new Token(t));
    }

    static async getOneByProfile(id) {
        const response = await db.query("SELECT * FROM tokens WHERE account_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate token.");
        } else {
            return new Token(response.rows[0]);
        }
    }

    static async getOneByToken(token) {
        const response = await db.query("SELECT * FROM tokens WHERE token = $1", [token]);

        console.log(response.rows)
        if (response.rows.length != 1) {
            throw new Error("Unable to locate token.");
        } else {
            return new Token(response.rows[0]);
        }
    }

    static async create(account_id) {
        const token = uuidv4();
        const response = await db.query("INSERT INTO tokens (account_id, token) VALUES ($1, $2) RETURNING *;", [account_id, token]);
        return new Token(response.rows[0]);
    }

    async destroy(token) {
        const response = await db.query("DELETE FROM tokens WHERE token = $1 RETURNING *;", [token]);
        if (response.rows.length != 1) {
            throw new Error("Unable to delete token.");
        } else {
            return new Token(response.rows[0]);
        }
    }
}

module.exports = Token;
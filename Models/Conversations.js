const db = require("../Database/connect");

class Conversation {
    constructor({conversation_id, account_id, conversation_title, language, timestamp}) {
        this.conversation_id=conversation_id;
        this.account_id=account_id;
        this.conversation_title=conversation_title;
        this.language=language;
        this.timestamp=timestamp;
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM conversations;");
        if (response.rows.length === 0) {
            throw new Error("No conversations available.")
        }
        return response.rows.map(c => new Conversation(c));
    }

    static async getByUser(id) {
        const response = await db.query("SELECT * FROM conversations WHERE account_id=$1;", [id]);

        if(response.rows.length === 0) {
            throw new Error("Unable to locate conversations for the user.")
        }

        return response.rows.map(c => new Conversation(c));
    }

    static async getOneById(id) {
        const response = await db.query("SELECT * FROM conversations WHERE conversation_id=$1;", [id]);

        if(response.rows.length != 1) {
            throw new Error("Unable to locate conversation.")
        }

        return new Conversation(response.rows[0]);
    }

    static async create(data) {
        const { account_id, conversation_title, language } = data;

        const timestamp = new Date();

        let response = await db.query("INSERT INTO conversations (account_id, conversation_title, language, timestamp) VALUES ($1, $2, $3, $4) RETURNING *;", [account_id, conversation_title, language, timestamp]);
        
        if(response.rows.length === 0) {
            throw new Error("Unable to create conversation.")
        }
        
        return new Conversation(response.rows[0]);
    }

    async update(data) {
        const response = await db.query("UPDATE conversations SET conversation_title = $1 WHERE conversation_id = $2 RETURNING *;",
            [ data.conversation_title, this.conversation_id ]);
        if (response.rows.length != 1) {
            throw new Error("Unable to update conversation title.")
        }
        return new Conversation(response.rows[0]);
    }

    async destroy() {
        const response = await db.query("DELETE FROM conversations WHERE conversation_id = $1 RETURNING *;", [this.conversation_id]);
        return new Conversation(response.rows[0]);
    }
   
}

module.exports = Conversation
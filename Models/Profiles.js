const db = require("../Database/connect");

class Profile {
    constructor({account_id, name, email, password}) {
        this.account_id=account_id;
        this.name=name;
        this.email=email;
        this.password=password;
    }

    static async getAll() {
        const response = await db.query("SELECT * FROM profiles;");
        if (response.rows.length === 0) {
            throw new Error("No profiles available.")
        }
        return response.rows.map(p => new Profile(p));
    }

    static async getOneById(id) {
        const response = await db.query("SELECT * FROM profiles WHERE account_id=$1;", [id]);

        if(response.rows.length === 0) {
            throw new Error("Unable to locate profile.")
        }

        return new Profile(response.rows[0]);
    }

    static async getOneByEmail(email) {
        const response = await db.query("SELECT * FROM profiles WHERE email=$1;", [email]);

        if(response.rows.length === 0) {
            throw new Error("Unable to locate profile.")
        }

        return new Profile(response.rows[0]);
    }

    static async create(data) {
        const { name, email, password } = data;

        const existingProfile = await db.query("SELECT * FROM profiles WHERE email = $1", [email]);
        if (existingProfile.rows.length > 0) {
            throw new Error("Email already exists");
        }

        let response = await db.query("INSERT INTO profiles (name, email, password) VALUES ($1, $2, $3) RETURNING *;", [name, email, password]);
        
        return new Profile(response.rows[0]);
    }

    async update(data) {
        const response = await db.query("UPDATE profiles SET name = $1 WHERE account_id = $2 RETURNING *;",
            [ data.name, this.account_id ]);
        if (response.rows.length != 1) {
            throw new Error("Unable to update name.")
        }
        return new Profile(response.rows[0]);
    }

    async destroy() {
        const response = await db.query("DELETE FROM profiles WHERE account_id = $1 RETURNING *;", [this.account_id]);
        return new Profile(response.rows[0]);
    }
   
}

module.exports=Profile
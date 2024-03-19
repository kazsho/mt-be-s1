require("dotenv").config();

const fs = require("fs");

const db = require("./connect");

const sql = fs.readFileSync("./Database/Database.sql").toString();

console.log(sql)

const setupDatabase = async () => {
  try {
    const data = await db.query(sql);
    console.log("setup complete");
  } catch (error) {
    console.log(error);
  } finally {
    db.end();
  }
};

setupDatabase();

module.exports = setupDatabase;


const { Pool } = require("pg");
const db = require("../Database/connect");

describe("Database Connection", () => {
  it("should create a database connection without errors", async () => {
    process.env.DB_URL = "postgres://llrnmqet:y0t4PYQsVRYro_PHm9HwhuX1OCk14KmB@tyke.db.elephantsql.com/llrnmqet";
    const db = require("../Database/connect");
    expect(db).toBeDefined();
  });
});

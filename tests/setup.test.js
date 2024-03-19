const fs = require("fs");
const db = require("../Database/connect");
const setupDatabase = require("../Database/setup");
const sqlContents = `CREATE TABLE IF NOT EXISTS users (·
    id SERIAL PRIMARY KEY,·
    username VARCHAR(255) NOT NULL,·
    email VARCHAR(255) NOT NULL·
);·
`

describe("Database Setup", () => {

  it("should initialize the database with the contents of the SQL file", async () => {
    const dbQueryResult = { rows: [], rowCount: 0 };

    jest.spyOn(fs, "readFileSync").mockReturnValue(sqlContents);
    db.query = jest.fn().mockResolvedValue(dbQueryResult);
    db.end = jest.fn()
    console.log = jest.spyOn(console, 'log');

    await setupDatabase();

    expect([
      "C:\\Users\\rahma\\Coding Practice\\Lap 4\\Project\\mt-be-s1\\node_modules\\jest-circus\\build\\utils.js",
      "C:\\Users\\rahma\\Coding Practice\\Lap 4\\Project\\mt-be-s1\\node_modules\\jest-mock\\build\\index.js"
    ]).toContainEqual(fs.readFileSync.mock.calls[0][0]);
    expect(fs.readFileSync.mock.calls[0][1]).toEqual('utf8');
    expect(db.query).toHaveBeenCalledWith(expect.stringMatching(/\s*CREATE TABLE IF NOT EXISTS users \(\s*id SERIAL PRIMARY KEY,\s*username VARCHAR\(255\) NOT NULL,\s*email VARCHAR\(255\) NOT NULL\s*\);/));
    expect(console.log).toHaveBeenCalledWith("setup complete");
    expect(db.end).toHaveBeenCalled();
  });

  it("should handle errors during database setup", async () => {
    const error = new Error("Database setup failed");

    jest.spyOn(fs, "readFileSync").mockReturnValue(sqlContents);
    db.query = jest.fn().mockRejectedValue(error);
    db.end = jest.fn()
    console.log = jest.spyOn(console, 'log');

    await setupDatabase();

    expect([
      "C:\\Users\\rahma\\Coding Practice\\Lap 4\\Project\\mt-be-s1\\node_modules\\jest-circus\\build\\utils.js",
      "C:\\Users\\rahma\\Coding Practice\\Lap 4\\Project\\mt-be-s1\\node_modules\\jest-mock\\build\\index.js"
    ]).toContainEqual(fs.readFileSync.mock.calls[0][0]);    
    expect(fs.readFileSync.mock.calls[0][1]).toEqual('utf8');
    expect(db.query).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(error);
    expect(db.end).toHaveBeenCalled();
  });
});
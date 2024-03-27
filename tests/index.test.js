const app = require("../app");

describe("Server startup", () => {
  it("should start the server and log the port number", async () => {
    process.env.PORT = 3000;

    jest.mock("dotenv", () => ({
      config: jest.fn(),
    }));
    jest.spyOn(app, "listen").mockImplementation((port, callback) => {
      callback();
    });
    console.log = jest.fn();

    require("../index");

    expect(console.log).toHaveBeenCalledWith("API listening on port 3000...");
  });
});

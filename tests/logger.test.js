const logRoutes = require("../middleware/logger");

describe("logRoutes middleware", () => {
  it("should log request method and original URL", () => {
    const req = {
      method: "GET",
      originalUrl: "/test",
    };
    const res = {};

    const next = jest.fn();
    console.log = jest.spyOn(console, "log");

    logRoutes(req, res, next);

    expect(console.log).toHaveBeenCalledWith("GET", "/test");
    expect(next).toHaveBeenCalled();
  });
});

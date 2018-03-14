jest.mock("../../logger", () => ({
  info: jest.fn("info")
}));

const logger = require("../../logger");
const config = require("../config");

describe("config/config", () => {
  it("should have the proper database config", () => {
    expect(config).toMatchSnapshot();
  });

  it("should configure logging for development config", () => {
    const msg = "my message";
    config.development.logging(msg);
    expect(logger.info).toHaveBeenCalledWith(msg);
  });

  it("should configure logging for production config", () => {
    const msg = "my message";
    config.production.logging(msg);
    expect(logger.info).toHaveBeenCalledWith(msg);
  });
});

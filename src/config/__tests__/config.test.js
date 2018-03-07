const config = require("../config");

describe("config/config", () => {
  it("should have the proper database config", () => {
    expect(config).toMatchSnapshot();
  });
});

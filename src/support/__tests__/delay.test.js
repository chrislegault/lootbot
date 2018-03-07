const delay = require("../delay");

describe("support/delay", () => {
  it("should delay a function by the passed in interval", done => {
    delay(1).then(() => done());
    jest.runOnlyPendingTimers();
  });
});

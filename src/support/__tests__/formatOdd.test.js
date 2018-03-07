const formatOdd = require("../formatOdd");

describe("support/formatOdd", () => {
  it("should format based on passed in count and total", () => {
    expect(formatOdd(1, 11)).toBe("9.09% (1 in 11)");
  });
});

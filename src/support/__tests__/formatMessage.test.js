const formatMessage = require("../formatMessage");

describe("support/formatMessage", () => {
  beforeEach(() => {
    this.reward = { name: "Prize" };
    this.user = { id: "1234" };
    this.tier = { name: "Common" };
  });

  it("should replace <reward> with formatted reward name", () => {
    const message = formatMessage(
      "Sweet <reward>",
      this.reward,
      this.user,
      this.tier
    );

    expect(message).toBe(`Sweet **${this.reward.name}**`);
  });

  it("should replace <user> with formatted user id", () => {
    const message = formatMessage(
      "Hey <user>",
      this.reward,
      this.user,
      this.tier
    );

    expect(message).toBe(`Hey <@${this.user.id}>`);
  });

  it("should replace <tier> with tier name", () => {
    const message = formatMessage(
      "Tier <tier>",
      this.reward,
      this.user,
      this.tier
    );

    expect(message).toBe(`Tier ${this.tier.name}`);
  });
});

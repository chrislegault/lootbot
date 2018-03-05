jest.mock("discord-akairo");

jest.mock("../../../models", () => ({
  Loot: { findAll: jest.fn("findAll") },
  Tier: { findAll: jest.fn("findAll") }
}));

const { Loot, Tier } = require("../../../models");
const { Command } = require("discord-akairo");
const ListCommand = require("../list");

describe("commands/loot/list", () => {
  beforeEach(() => {
    this.command = new ListCommand();

    this.msg = {
      guild: { id: "1234" },
      channel: {
        send: jest.fn("send").mockReturnValue(Promise.resolve())
      }
    };
  });

  it("should configure properly", () => {
    expect(Command).toMatchSnapshot();
  });

  it("should fetch the loot for the guild", () => {
    this.command.exec(this.msg);

    expect(Tier.findAll).toHaveBeenCalledWith({
      include: [{ model: Loot }],
      where: { guild: this.msg.guild.id },
      order: [["weight", "DESC"], ["Loots", "name", "ASC"]]
    });
  });

  it("should notify when no loot is found for the guild", async () => {
    Tier.findAll.mockReturnValue([]);
    await this.command.exec(this.msg);
    expect(this.msg.channel.send).toHaveBeenCalledWith("No loot found.");
  });

  it("should list the loot", async () => {
    Tier.findAll.mockReturnValue([
      {
        name: "Common",
        Loots: []
      },
      {
        name: "Uncommon",
        Loots: [{ name: "Test Loot 1" }, { name: "Test Loot 2" }]
      }
    ]);

    await this.command.exec(this.msg);
    expect(this.msg.channel.send).toMatchSnapshot();
  });

  it("should notify if any errors occur", async () => {
    Tier.findAll.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      "An error occurred listing loot."
    );
  });
});

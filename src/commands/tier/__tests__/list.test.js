jest.mock("discord-akairo");

jest.mock("../../../models", () => ({
  Tier: { findAll: jest.fn("findAll") }
}));

const { Tier } = require("../../../models");
const { checkManagePermissions } = require("../../../support");
const { Command } = require("discord-akairo");
const ListCommand = require("../list");

describe("commands/tier/list", () => {
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

  it("should have the proper permission check", () => {
    expect(Command.mock.calls[0][1].options.permissions).toBe(
      checkManagePermissions
    );
  });

  it("should fetch the tiers for the guild", () => {
    Tier.findAll.mockReturnValue([]);
    this.command.exec(this.msg);

    expect(Tier.findAll).toHaveBeenCalledWith({
      where: { guild: this.msg.guild.id },
      order: [["weight", "DESC"]]
    });
  });

  it("should notify when no loot is found for the guild", async () => {
    Tier.findAll.mockReturnValue([]);
    await this.command.exec(this.msg);
    expect(this.msg.channel.send).toHaveBeenCalledWith("No tiers found");
  });

  it("should list the tiers", async () => {
    Tier.findAll.mockReturnValue([
      {
        name: "Common",
        color: 4737096,
        image: "test.png",
        weight: 10,
        luckyWeight: 20
      },
      {
        name: "Uncommon",
        color: 4171061,
        image: "test2.png",
        weight: 10,
        luckyWeight: 20
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
      "An error occurred listing tiers"
    );
  });

  it("should properly format a color that would contain 0s in hex", async () => {
    Tier.findAll.mockReturnValue([
      {
        name: "Common",
        color: 17, // #000001
        image: "test.png",
        weight: 10,
        luckyWeight: 20
      }
    ]);

    await this.command.exec(this.msg);

    expect(this.msg.channel.send).toMatchSnapshot();
  });
});

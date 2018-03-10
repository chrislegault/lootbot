jest.mock("discord-akairo");

jest.mock("../../../models", () => ({
  Tier: { findOne: jest.fn("findOne") }
}));

const { Tier } = require("../../../models");
const { Command } = require("discord-akairo");
const { checkManagePermissions } = require("../../../support");
const RemoveCommand = require("../remove");

describe("commands/loot/remove", () => {
  beforeEach(() => {
    this.command = new RemoveCommand();
    this.args = { name: "Tier 1" };

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

  it("should have the manage permission check", () => {
    expect(Command.mock.calls[0][1].options.permissions).toBe(
      checkManagePermissions
    );
  });

  it("should destroy the passed in tier", async () => {
    const tier = { destroy: jest.fn("destroy") };
    tier.destroy.mockReturnValue(tier);
    Tier.findOne.mockReturnValue(tier);
    await this.command.exec(this.msg, this.args);

    expect(Tier.findOne).toHaveBeenCalledWith({
      where: { name: this.args.name, guild: this.msg.guild.id }
    });

    expect(tier.destroy).toHaveBeenCalled();

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} removed`
    );
  });

  it("should notify when the passed in loot does not exist", async () => {
    Tier.findOne.mockReturnValue(null);
    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `${this.args.name} not found`
    );
  });

  it("should notify if any errors occur", async () => {
    Tier.findOne.mockImplementation(() => {
      throw new Error("test");
    });

    await this.command.exec(this.msg, this.args);

    expect(this.msg.channel.send).toHaveBeenCalledWith(
      `An error occurred removing ${this.args.name}`
    );
  });
});
